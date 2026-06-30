"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Loader2,
  ExternalLink,
  Calendar,
  User as UserIcon,
  Heart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
import type { Publication } from "@/types/api";

export default function UserPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { favoredIds, toggle } = useFavorites("publication");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.publications.getPublications();
        if (active) setPublications([...data]);
      } catch (error) {
        console.error("Failed to fetch publications:", error);
        if (active) toast.error("Failed to load publications");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filtered = publications.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q)
    );
  });

  const handleDownload = (p: Publication) => {
    if (!p.fileUrl) return;
    const link = document.createElement("a");
    link.href = p.fileUrl;
    link.download = `${p.title || "publication"}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Publications</h1>
        <p className="text-gray-700">Access research papers, articles, and publications from BCNS.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, category, or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-full bg-muted p-4">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                {search ? "No matching publications" : "No publications yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "Publications will appear here once they are added."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.category && (
                      <Badge variant="secondary" className="capitalize whitespace-nowrap">
                        {p.category}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => toggle(p.id)}
                    >
                      <Heart className={`h-4 w-4 ${favoredIds.has(p.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {p.author && (
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" /> {p.author}
                    </span>
                  )}
                  {(p.publishedAt || p.createdAt) && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(p.publishedAt || p.createdAt)}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {p.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{p.content}</p>
                )}
                <div className="mt-auto flex items-center gap-2 pt-2">
                  {p.fileUrl ? (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" /> View PDF
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(p)}>
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> No file attached
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
