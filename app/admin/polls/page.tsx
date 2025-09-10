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
import { Switch } from "@/components/ui/switch";
import { BarChart3, Plus, Edit, Trash2, Vote, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { Poll } from "@/types/api";

export default function PollsManagement() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    options: [{ id: "1", text: "", votes: 0 }],
    isActive: true,
    endDate: "",
  });
  const [optionInput, setOptionInput] = useState("");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      // Mock data
      setPolls([
        {
          id: "1",
          question: "What should be the main focus of our next conference?",
          options: [
            { id: "1", text: "Pediatric Neurology", votes: 45 },
            { id: "2", text: "Research Methodologies", votes: 32 },
            { id: "3", text: "Clinical Cases", votes: 28 },
            { id: "4", text: "Technology in Neurology", votes: 15 },
          ],
          isActive: true,
          endDate: "2024-12-31",
          createdBy: "admin@bcns.org.bd",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          question: "Which workshop topic interests you most?",
          options: [
            { id: "1", text: "EEG Interpretation", votes: 38 },
            { id: "2", text: "Neuroimaging", votes: 42 },
            { id: "3", text: "Genetic Testing", votes: 25 },
            { id: "4", text: "Treatment Protocols", votes: 35 },
          ],
          isActive: false,
          endDate: "2024-11-30",
          createdBy: "admin@bcns.org.bd",
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async () => {
    try {
      // API call will be implemented
      
      toast.success("Poll created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        question: "",
        options: [{ id: "1", text: "", votes: 0 }],
        isActive: true,
        endDate: "",
      });
      fetchPolls();
    } catch (error) {
      toast.error("Failed to create poll");
    }
  };

  const handleEditPoll = async () => {
    if (!editingPoll) return;
    
    try {
      // API call will be implemented
      
      toast.success("Poll updated successfully");
      setIsEditDialogOpen(false);
      setEditingPoll(null);
      setFormData({
        question: "",
        options: [{ id: "1", text: "", votes: 0 }],
        isActive: true,
        endDate: "",
      });
      fetchPolls();
    } catch (error) {
      toast.error("Failed to update poll");
    }
  };

  const handleDeletePoll = async (_pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;

    try {
      // API call will be implemented
      
      toast.success("Poll deleted successfully");
      fetchPolls();
    } catch (error) {
      toast.error("Failed to delete poll");
    }
  };

  const openEditDialog = (poll: Poll) => {
    setEditingPoll(poll);
    setFormData({
      question: poll.question,
      options: [...poll.options],
      isActive: poll.isActive,
      endDate: poll.endDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const addOption = () => {
    if (optionInput.trim()) {
      const newOption = {
        id: Date.now().toString(),
        text: optionInput.trim(),
        votes: 0,
      };
      setFormData({
        ...formData,
        options: [...formData.options, newOption],
      });
      setOptionInput("");
    }
  };

  const removeOption = (optionId: string) => {
    if (formData.options.length > 1) {
      setFormData({
        ...formData,
        options: formData.options.filter(option => option.id !== optionId),
      });
    }
  };

  const updateOptionText = (optionId: string, text: string) => {
    setFormData({
      ...formData,
      options: formData.options.map(option =>
        option.id === optionId ? { ...option, text } : option
      ),
    });
  };

  const getTotalVotes = (options: Poll["options"]) => {
    return options.reduce((total, option) => total + option.votes, 0);
  };

  const getVotePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Create a new poll for society members to vote on
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="col-span-3"
                  placeholder="What would you like to ask?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Poll is currently active</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Options</Label>
                <div className="col-span-3 space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) => updateOptionText(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.options.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      placeholder="Add new option"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    />
                    <Button type="button" variant="outline" onClick={addOption}>
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreatePoll}>
                Create Poll
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
                <TableHead>Status</TableHead>
                <TableHead>Total Votes</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {polls.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{poll.question}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {poll.options.length} options
                      </div>
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
                        onClick={() => {
                          // TODO: Implement view results functionality
                          toast.info("View results functionality coming soon");
                        }}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(poll)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePoll(poll.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Poll Results Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle className="text-lg">{poll.question}</CardTitle>
              <CardDescription>
                {poll.isActive ? "Active Poll" : "Closed Poll"} • {getTotalVotes(poll.options)} total votes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = getVotePercentage(option.votes, getTotalVotes(poll.options));
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{option.text}</span>
                        <span className="font-medium">{option.votes} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Poll Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Poll</DialogTitle>
            <DialogDescription>
              Update poll information and options
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-question" className="text-right">
                Question
              </Label>
              <Textarea
                id="edit-question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Poll is currently active</Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Options</Label>
              <div className="col-span-3 space-y-3">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) => updateOptionText(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.options.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Add new option"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                  />
                  <Button type="button" variant="outline" onClick={addOption}>
                    Add Option
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditPoll}>
              Update Poll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
