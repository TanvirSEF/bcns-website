"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, User, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "react-toastify";
import { Document, DocumentStatus } from "@/types/api";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";

interface DocumentWithUser extends Document {
  uploadedBy: string;
  userEmail: string;
}

export default function DocumentsManagement() {
  const [documents, setDocuments] = useState<DocumentWithUser[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const users = await api.admin.getAllUsers({ limit: 0 });
      
      // Extract all documents from all users
      const allDocuments: DocumentWithUser[] = [];
      
      users.forEach((user) => {
        const userWithDocs = user as typeof user & { documents?: unknown[] };
        const userDocs = Array.isArray(userWithDocs.documents) ? userWithDocs.documents : [];
        
        userDocs.forEach((doc: unknown) => {
          const docData = doc as {
            _id?: string;
            id?: string;
            title?: string;
            fileUrl?: string;
            status?: string;
            uploadedAt?: string;
            createdAt?: string;
            description?: string;
          };
          
          const uploadedAt = docData.uploadedAt || docData.createdAt;
          
          // Convert date to ISO string format
          let createdAtValue: string;
          if (uploadedAt) {
            createdAtValue = typeof uploadedAt === 'string' 
              ? uploadedAt 
              : new Date(uploadedAt).toISOString();
          } else {
            createdAtValue = new Date().toISOString();
          }
          
          const updatedAtValue = docData.createdAt 
            ? (typeof docData.createdAt === 'string' ? docData.createdAt : new Date(docData.createdAt).toISOString())
            : createdAtValue;
          
          allDocuments.push({
            id: docData._id || docData.id || "",
            title: docData.title || "Untitled Document",
            fileUrl: docData.fileUrl || "",
            status: (docData.status as DocumentStatus) || DocumentStatus.PENDING,
            uploadedBy: user.id || "",
            userEmail: user.email,
            createdAt: createdAtValue,
            updatedAt: updatedAtValue,
            ...(docData.description && { description: docData.description }),
          });
        });
      });
      
      setDocuments(allDocuments);
      setFilteredDocuments(allDocuments);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // Filter documents by user email or document title
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocuments(documents);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = documents.filter((doc) => {
      const emailMatch = doc.userEmail.toLowerCase().includes(query);
      const titleMatch = doc.title.toLowerCase().includes(query);
      const descriptionMatch = doc.description?.toLowerCase().includes(query);
      
      return emailMatch || titleMatch || descriptionMatch;
    });

    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  // Reset page number when search query or documents change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, documents]);

  // Calculate paginated slices
  const totalPages = Math.ceil(filteredDocuments.length / pageSize);

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-end space-x-2 py-4 border-t px-4 bg-muted/10">
        <div className="flex min-w-[100px] items-center justify-center text-sm font-medium text-muted-foreground mr-4">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const handleDownload = (fileUrl: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      toast.error("Document URL not available");
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case DocumentStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case DocumentStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      <div className="space-y-8">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Documents Management</h1>
          <p className="text-muted-foreground">
            Manage society documents, reports, and publications
          </p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">Loading documents...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Documents Management</h1>
        <p className="text-muted-foreground">
          Manage society documents, reports, and publications
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                Review and manage document submissions
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by user email, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {searchQuery && (
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredDocuments.length} of {documents.length} documents
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocuments.length > 0 ? (
                    paginatedDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{document.title}</div>
                            {document.description && (
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {document.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(document.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{document.userEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {document.createdAt ? formatDate(document.createdAt) : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(document.fileUrl)}
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Download className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchQuery ? "No documents found matching your search" : "No documents found"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {searchQuery 
                              ? "Try a different search term or clear the search to see all documents."
                              : "Documents will appear here once users upload them."
                            }
                          </p>
                          {searchQuery && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSearchQuery("")}
                              className="mt-2"
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
