"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, User, Calendar, FileText, Upload, Loader2, Download } from "lucide-react";
import { toast } from "react-toastify";
import { Publication } from "@/types/api";
import { api } from "@/lib/api";

export default function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const response = await api.publications.getPublications();
      setPublications([...response]);
    } catch (error) {
      console.error("Failed to fetch publications:", error);
      toast.error("Failed to fetch publications");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setFilePreview(file.name);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
    });
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleCreatePublication = async () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields (Title, Description, Category)");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.publications.createPublication({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file: selectedFile,
      });
      
      toast.success("Publication created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPublications();
    } catch (error) {
      console.error("Failed to create publication:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create publication");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="text-lg">Loading publications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications Management</h1>
          <p className="text-muted-foreground">
            Manage research papers, articles, and academic publications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Publication</DialogTitle>
              <DialogDescription>
                Add a new research publication or article
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-3"
                  placeholder="Publication title"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  rows={4}
                  placeholder="Publication description"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="guideline">Guideline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  PDF File <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      required
                    />
                    {filePreview && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{filePreview}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB. Only PDF files are allowed.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreatePublication} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Publication
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>All Publications</CardTitle>
          <CardDescription>
            Manage and review academic publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publication</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No publications found. Create your first publication to get started.
                  </TableCell>
                </TableRow>
              ) : (
                publications.map((publication) => {
                  // Type assertion to access category and fileUrl
                  const pub = publication as any;
                  return (
                    <TableRow key={publication.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{publication.title}</div>
                          {publication.content && (
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {publication.content}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pub.category ? (
                          <Badge variant="secondary" className="capitalize">
                            {pub.category}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {publication.author || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pub.fileUrl ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(pub.fileUrl, '_blank')}
                              className="h-8"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              <span className="text-xs">View PDF</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = pub.fileUrl;
                                link.download = `${publication.title}.pdf`;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="h-8"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No file</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {publication.publishedAt ? formatDate(publication.publishedAt) : "Not published"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pub.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(pub.fileUrl, '_blank')}
                            title="View PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
