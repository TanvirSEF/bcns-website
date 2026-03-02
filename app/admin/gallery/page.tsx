"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, FolderOpen, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Album, Photo } from "@/types/api";
import { api } from "@/lib/api";
import { Lightbox } from "@/components/ui/lightbox";

export default function GalleryManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCreateAlbumDialogOpen, setIsCreateAlbumDialogOpen] = useState(false);
  const [isUploadPhotoDialogOpen, setIsUploadPhotoDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumFormData, setAlbumFormData] = useState({
    title: "",
    description: "",
    coverPhoto: "",
  });
  const [photoFormData, setPhotoFormData] = useState({
    caption: "",
    albumId: "",
    photoFiles: [] as File[],
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await api.gallery.getAlbums();
      const albumsWithCover = await Promise.all(
        response.map(async (album) => {
          try {
            // Always fetch photos to get accurate count and cover photo
            const photos = await api.gallery.getAlbumPhotos(album.id);
            const photoCount = photos.length;
            const firstPhoto = photos[0];

            // Update album with accurate photo count
            let updatedAlbum: Album = { ...album, photoCount } as Album;

            // If album has photos but no cover photo, set first photo as cover
            if (firstPhoto && firstPhoto.imageUrl && !album.coverPhoto) {
              const coverPhotoUrl = String(firstPhoto.imageUrl);
              updatedAlbum = { ...updatedAlbum, coverPhoto: coverPhotoUrl } as Album;
            } else if (album.coverPhoto) {
              // Keep existing cover photo
              updatedAlbum = { ...updatedAlbum, coverPhoto: album.coverPhoto } as Album;
            }

            return updatedAlbum;
          } catch (error) {
            // If fetching photos fails, use the album as is with backend photoCount
            console.log(`Could not fetch photos for album ${album.id}:`, error);
            return album;
          }
        })
      );
      setAlbums([...albumsWithCover]);
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (albumId: string) => {
    try {
      const response = await api.gallery.getAlbumPhotos(albumId);
      setPhotos([...response]);

      // Update album photo count and cover photo in state
      const photoCount = response.length;
      const firstPhoto = response[0];

      setAlbums((prevAlbums) =>
        prevAlbums.map((album) => {
          if (album.id === albumId) {
            // If album has photos but no cover photo, set first photo as cover
            if (firstPhoto && firstPhoto.imageUrl && !album.coverPhoto) {
              return { ...album, photoCount, coverPhoto: String(firstPhoto.imageUrl) } as Album;
            }

            return { ...album, photoCount };
          }
          return album;
        })
      );
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Failed to fetch photos");
    }
  };

  const handleCreateAlbum = async () => {
    try {
      if (!albumFormData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      await api.gallery.createAlbum({
        title: albumFormData.title,
        ...(albumFormData.description && { description: albumFormData.description }),
        ...(albumFormData.coverPhoto && { coverPhoto: albumFormData.coverPhoto }),
      });

      toast.success("Album created successfully");
      setIsCreateAlbumDialogOpen(false);
      setAlbumFormData({ title: "", description: "", coverPhoto: "" });
      fetchAlbums();
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Failed to create album");
    }
  };


  const handleUploadPhoto = async () => {
    try {
      if (!selectedAlbum) {
        toast.error("Please select an album first");
        return;
      }

      if (photoFormData.photoFiles.length === 0) {
        toast.error("Please select at least one photo file");
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      const totalFiles = photoFormData.photoFiles.length;
      let successCount = 0;
      let failCount = 0;
      let firstUploadedPhotoUrl: string | null = null;
      const isFirstPhoto = selectedAlbum.photoCount === 0;

      // Upload files sequentially with progress
      for (let i = 0; i < photoFormData.photoFiles.length; i++) {
        const file = photoFormData.photoFiles[i];
        if (!file) continue;

        try {
          const uploadedPhoto = await api.gallery.uploadPhoto(selectedAlbum.id, {
            ...(photoFormData.caption && { caption: photoFormData.caption }),
            photo: file,
          });

          // If this is the first photo in the album, save its URL for cover photo
          if (isFirstPhoto && i === 0 && uploadedPhoto.imageUrl) {
            firstUploadedPhotoUrl = uploadedPhoto.imageUrl;
          }

          successCount++;
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          failCount++;
        }

        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      // If first photo was uploaded, update album cover photo in frontend state
      if (isFirstPhoto && firstUploadedPhotoUrl && selectedAlbum && successCount > 0) {
        // Convert imageUrl to string (URL type is string alias)
        const coverPhotoUrl = String(firstUploadedPhotoUrl);

        // Update the album in the albums state to show cover photo
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) =>
            album.id === selectedAlbum.id
              ? { ...album, coverPhoto: coverPhotoUrl }
              : album
          )
        );

        // Also update selectedAlbum state if it's still selected
        setSelectedAlbum((prev) =>
          prev && prev.id === selectedAlbum.id
            ? { ...prev, coverPhoto: coverPhotoUrl }
            : prev
        );
      }

      setUploading(false);
      setUploadProgress(0);

      if (successCount > 0) {
        toast.success(
          `${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`
        );
      } else {
        toast.error("Failed to upload photos");
      }

      setIsUploadPhotoDialogOpen(false);
      setPhotoFormData({ caption: "", albumId: "", photoFiles: [] });

      if (selectedAlbum && successCount > 0) {
        // Fetch photos to update the list and cover photo
        await fetchPhotos(selectedAlbum.id);

        // Update selected album state with latest data
        const updatedAlbums = await api.gallery.getAlbums();
        const foundAlbum = updatedAlbums.find(a => a.id === selectedAlbum.id);
        if (foundAlbum) {
          let updatedAlbum = { ...foundAlbum };

          // If album has no cover photo but has photos, get the first photo as cover
          if (!updatedAlbum.coverPhoto && updatedAlbum.photoCount > 0) {
            try {
              const photos = await api.gallery.getAlbumPhotos(updatedAlbum.id);
              const firstPhoto = photos[0];
              if (firstPhoto && firstPhoto.imageUrl) {
                updatedAlbum = { ...updatedAlbum, coverPhoto: String(firstPhoto.imageUrl) };
              }
            } catch (error) {
              console.log(`Could not fetch photos for album ${updatedAlbum.id}:`, error);
            }
          }
          setSelectedAlbum(updatedAlbum);

          // Update albums list state
          setAlbums((prevAlbums) =>
            prevAlbums.map((album) => {
              if (album.id === selectedAlbum.id) {
                return updatedAlbum;
              }
              return album;
            })
          );
        }
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      if (!selectedAlbum) return;
      await api.gallery.deletePhoto(selectedAlbum.id, photoId);

      toast.success("Photo deleted successfully");
      fetchPhotos(selectedAlbum.id);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this entire album and all its photos? This action cannot be undone.")) return;

    try {
      await api.gallery.deleteAlbum(albumId);
      toast.success("Album deleted successfully");
      fetchAlbums();
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album");
    }
  };


  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    fetchPhotos(album.id);
  };

  const closeAlbum = async () => {
    setSelectedAlbum(null);
    setPhotos([]);
    // Refresh albums to ensure cover photos and counts are up to date
    await fetchAlbums();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage photo albums and images for the society
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateAlbumDialogOpen} onOpenChange={setIsCreateAlbumDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
                <DialogDescription>
                  Create a new photo album
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={albumFormData.title}
                    onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={albumFormData.description}
                    onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coverPhoto" className="text-right">
                    Cover Photo URL
                  </Label>
                  <Input
                    id="coverPhoto"
                    value={albumFormData.coverPhoto}
                    onChange={(e) => setAlbumFormData({ ...albumFormData, coverPhoto: e.target.value })}
                    className="col-span-3"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateAlbum}>
                  Create Album
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedAlbum && (
            <Dialog open={isUploadPhotoDialogOpen} onOpenChange={setIsUploadPhotoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Upload Photo to {selectedAlbum.title}</DialogTitle>
                  <DialogDescription>
                    Add a new photo to this album
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo-caption" className="text-right">
                      Caption
                    </Label>
                    <Input
                      id="photo-caption"
                      value={photoFormData.caption}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, caption: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter photo caption (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo-file" className="text-right">
                      Photo Files
                    </Label>
                    <Input
                      id="photo-file"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setPhotoFormData({ ...photoFormData, photoFiles: files });
                      }}
                      className="col-span-3 cursor-pointer"
                      disabled={uploading}
                    />
                  </div>
                  {photoFormData.photoFiles.length > 0 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm text-muted-foreground">
                        Selected ({photoFormData.photoFiles.length})
                      </Label>
                      <div className="col-span-3 space-y-1 max-h-32 overflow-y-auto">
                        {photoFormData.photoFiles.map((file, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {uploading && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-sm">
                        Uploading
                      </Label>
                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            {Math.round(uploadProgress)}% - Uploading photos...
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleUploadPhoto}>
                    Upload Photo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {!selectedAlbum ? (
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-muted/50 border-b">
            <CardTitle>Photo Albums</CardTitle>
            <CardDescription>
              Manage and organize photo collections
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {albums.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No albums created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {albums.map((album, index) => (
                  <Card
                    key={`${album.id}-${index}`}
                    className="cursor-pointer border border-gray-200 overflow-hidden bg-white p-0 max-w-sm mx-auto"
                    onClick={() => openAlbum(album)}
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden w-full">
                      {album.coverPhoto ? (
                        <Image
                          src={album.coverPhoto}
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}

                      {/* Photo count badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm">
                        {album.photoCount || 0} photos
                      </div>
                    </div>
                    <div className="p-5 bg-white relative">
                      {/* Delete album button */}
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlbum(album.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 pr-8">
                        {album.title}
                      </h3>
                      {album.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {album.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {album.photoCount || 0} photos
                        </span>
                        <span>{formatDate(album.createdAt || "")}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={closeAlbum}
                className="gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Back to Albums
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedAlbum.title}</h2>
                {selectedAlbum.description && (
                  <p className="text-muted-foreground mt-1">{selectedAlbum.description}</p>
                )}
              </div>
            </div>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>Photos in {selectedAlbum.title}</CardTitle>
              <CardDescription>
                Manage photos in this album
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No photos in this album yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo.id}-${index}`}
                      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title || "Photo"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                        {/* Zoom Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <Camera className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>

                        {/* Delete button overlay */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 shadow-sm rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lightbox */}
      {selectedAlbum && photos.length > 0 && (
        <Lightbox
          images={photos.map((p) => p.imageUrl)}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => {
            setCurrentImageIndex((prev) =>
              prev === photos.length - 1 ? 0 : prev + 1
            );
          }}
          onPrevious={() => {
            setCurrentImageIndex((prev) =>
              prev === 0 ? photos.length - 1 : prev - 1
            );
          }}
          title={selectedAlbum.title}
        />
      )}

    </div>
  );
}
