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
import { BarChart3, Plus, Vote, Calendar, Loader2, X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Poll } from "@/types/api";
import { api, PollResults } from "@/lib/api";

export default function PollsManagement() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedPollResults, setSelectedPollResults] = useState<PollResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: [{ name: "" }],
    startDate: "",
    endDate: "",
  });
  const [optionInput, setOptionInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Poll | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await api.polls.getPolls();
      setPolls([...response]);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
      toast.error("Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  };

  const fetchPollResults = async (pollId: string) => {
    try {
      const results = await api.polls.getPollResults(pollId);
      setSelectedPollResults(results);
      setIsResultsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch poll results:", error);
      toast.error("Failed to fetch poll results");
    }
  };

  const handleCreatePoll = async () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate options
    const validOptions = formData.options.filter(opt => opt.name.trim() !== "");
    if (validOptions.length === 0) {
      toast.error("At least one option is required");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.polls.createPoll({
        title: formData.title,
        description: formData.description,
        options: validOptions,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      
      toast.success("Poll created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPolls();
    } catch (error) {
      console.error("Failed to create poll:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      options: [{ name: "" }],
      startDate: "",
      endDate: "",
    });
    setOptionInput("");
  };

  const handleDeleteClick = (poll: Poll) => {
    setDeleteTarget(poll);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await api.polls.deletePoll(deleteTarget.id);
      toast.success("Poll deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchPolls();
    } catch (error) {
      console.error("Failed to delete poll:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete poll");
    } finally {
      setIsDeleting(false);
    }
  };

  const addOption = () => {
    if (optionInput.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, { name: optionInput.trim() }],
      });
      setOptionInput("");
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      });
    }
  };

  const updateOption = (index: number, name: string) => {
    setFormData({
      ...formData,
      options: formData.options.map((opt, i) => (i === index ? { name } : opt)),
    });
  };

  const getTotalVotes = (options: Poll["options"]) => {
    return options.reduce((total, option) => total + option.votes, 0);
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
        <div className="text-lg">Loading polls...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polls Management</h1>
          <p className="text-muted-foreground">
            Create and manage polls for society members
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Create a new poll for society members to vote on
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
                  placeholder="Poll title"
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
                  placeholder="Poll description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Options <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3 space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option.name}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.options.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Type option name and click Add Option"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                  />
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
              <Button type="submit" onClick={handleCreatePoll} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Poll"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>All Polls</CardTitle>
          <CardDescription>
            Manage and monitor poll results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poll Question</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Votes</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {polls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No polls found. Create your first poll to get started.
                  </TableCell>
                </TableRow>
              ) : (
                polls.map((poll) => {
                  const pollData = poll as any;
                  return (
                    <TableRow key={poll.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{poll.question || pollData.title}</div>
                          {pollData.description && (
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {pollData.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {poll.options.length > 0 ? (
                            poll.options.slice(0, 3).map((option, index) => (
                              <div key={option.id || index} className="text-sm">
                                {index + 1}. {option.text}
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No options</span>
                          )}
                          {poll.options.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{poll.options.length - 3} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={poll.isActive ? "default" : "secondary"}>
                          {poll.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Vote className="h-4 w-4" />
                          {getTotalVotes(poll.options)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {poll.endDate ? formatDate(poll.endDate) : "No end date"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchPollResults(poll.id)}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(poll)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Poll Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Poll Results</DialogTitle>
            <DialogDescription>
              Detailed voting results and statistics
            </DialogDescription>
          </DialogHeader>
          {selectedPollResults && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedPollResults.question}</h3>
                {selectedPollResults.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPollResults.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Total Votes: <span className="font-medium">{selectedPollResults.totalVotes}</span>
                </p>
              </div>
              <div className="space-y-4">
                {selectedPollResults.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-muted-foreground">
                        {option.votes} votes ({option.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResultsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Poll Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setDeleteTarget(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Poll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.question || (deleteTarget as any)?.title}
              </span>
              ? All votes cast for this poll will also be removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
