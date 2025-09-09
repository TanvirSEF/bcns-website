"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, FolderOpen, Camera, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Album, Photo } from "@/types/api";

export default function GalleryManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateAlbumDialogOpen, setIsCreateAlbumDialogOpen] = useState(false);
  const [isEditAlbumDialogOpen, setIsEditAlbumDialogOpen] = useState(false);
  const [isUploadPhotoDialogOpen, setIsUploadPhotoDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumFormData, setAlbumFormData] = useState({
    title: "",
    description: "",
    coverPhoto: "",
  });
  const [photoFormData, setPhotoFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    albumId: "",
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await getAlbums();
      // setAlbums(response);
      
      // Mock data for now
      setAlbums([
        {
          id: "1",
          title: "Annual Conference 2024",
          description: "Photos from our annual neurology conference",
          coverPhoto: "/images/event1.png",
          photoCount: 25,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          title: "Workshop Sessions",
          description: "Hands-on workshop activities",
          coverPhoto: "/images/event2.png",
          photoCount: 18,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
        },
        {
          id: "3",
          title: "Member Meetups",
          description: "Regular member gatherings and networking",
          coverPhoto: "/images/event3.png",
          photoCount: 12,
          createdAt: "2024-01-20",
          updatedAt: "2024-01-20",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (albumId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await getAlbumPhotos(albumId);
      // setPhotos(response);
      
      // Mock data for now
      setPhotos([
        {
          id: "1",
          title: "Opening Ceremony",
          description: "Conference opening ceremony",
          imageUrl: "/images/event1.png",
          albumId: albumId,
          uploadedBy: "admin@bcns.org.bd",
          createdAt: "2024-01-01",
        },
        {
          id: "2",
          title: "Keynote Speaker",
          description: "Dr. Smith delivering keynote",
          imageUrl: "/images/event2.png",
          albumId: albumId,
          uploadedBy: "admin@bcns.org.bd",
          createdAt: "2024-01-01",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch photos");
    }
  };

  const handleCreateAlbum = async () => {
    try {
      // TODO: Replace with actual API call
      // await createAlbum(albumFormData);
      
      toast.success("Album created successfully");
      setIsCreateAlbumDialogOpen(false);
      setAlbumFormData({ title: "", description: "", coverPhoto: "" });
      fetchAlbums();
    } catch (error) {
      toast.error("Failed to create album");
    }
  };

  const handleEditAlbum = async () => {
    if (!editingAlbum) return;
    
    try {
      // TODO: Replace with actual API call
      // await updateAlbum(editingAlbum.id, albumFormData);
      
      toast.success("Album updated successfully");
      setIsEditAlbumDialogOpen(false);
      setEditingAlbum(null);
      setAlbumFormData({ title: "", description: "", coverPhoto: "" });
      fetchAlbums();
    } catch (error) {
      toast.error("Failed to update album");
    }
  };

  const handleDeleteAlbum = async (_albumId: string) => {
    if (!confirm("Are you sure you want to delete this album? All photos will be lost.")) return;

    try {
      // TODO: Replace with actual API call
      // await deleteAlbum(_albumId);
      
      toast.success("Album deleted successfully");
      fetchAlbums();
    } catch (error) {
      toast.error("Failed to delete album");
    }
  };

  const handleUploadPhoto = async () => {
    try {
      // TODO: Replace with actual API call
      // await uploadPhoto(photoFormData);
      
      toast.success("Photo uploaded successfully");
      setIsUploadPhotoDialogOpen(false);
      setPhotoFormData({ title: "", description: "", imageUrl: "", albumId: "" });
      if (selectedAlbum) {
        fetchPhotos(selectedAlbum.id);
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleDeletePhoto = async (_photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      // TODO: Replace with actual API call
      // await deletePhoto(_photoId);
      
      toast.success("Photo deleted successfully");
      if (selectedAlbum) {
        fetchPhotos(selectedAlbum.id);
      }
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  const openEditAlbumDialog = (album: Album) => {
    setEditingAlbum(album);
    setAlbumFormData({
      title: album.title,
      description: album.description || "",
      coverPhoto: album.coverPhoto || "",
    });
    setIsEditAlbumDialogOpen(true);
  };

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    fetchPhotos(album.id);
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
                    <Label htmlFor="photo-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="photo-title"
                      value={photoFormData.title}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="photo-description"
                      value={photoFormData.description}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo-url" className="text-right">
                      Image URL
                    </Label>
                    <Input
                      id="photo-url"
                      value={photoFormData.imageUrl}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, imageUrl: e.target.value })}
                      className="col-span-3"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Card key={album.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      {album.coverPhoto ? (
                        <Image
                          src={album.coverPhoto}
                          alt={album.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{album.title}</h3>
                      {album.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{album.photoCount || 0} photos</span>
                        <span>{formatDate(album.createdAt || "")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAlbum(album)}
                        className="flex-1"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAlbumDialog(album)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlbum(album.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedAlbum(null)}
            >
              ← Back to Albums
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedAlbum.title}</h2>
              {selectedAlbum.description && (
                <p className="text-muted-foreground">{selectedAlbum.description}</p>
              )}
            </div>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>Photos in {selectedAlbum.title}</CardTitle>
              <CardDescription>
                Manage photos in this album
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title || "Photo"}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">{photo.title || "Untitled"}</h4>
                        {photo.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {photo.description}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(photo.imageUrl, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Album Dialog */}
      <Dialog open={isEditAlbumDialogOpen} onOpenChange={setIsEditAlbumDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>
              Update album information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={albumFormData.title}
                onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={albumFormData.description}
                onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-coverPhoto" className="text-right">
                Cover Photo URL
              </Label>
              <Input
                id="edit-coverPhoto"
                value={albumFormData.coverPhoto}
                onChange={(e) => setAlbumFormData({ ...albumFormData, coverPhoto: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditAlbum}>
              Update Album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
