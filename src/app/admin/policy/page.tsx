// pages/admin/policies.tsx
"use client"
import { useState, useEffect, FormEvent } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit } from 'lucide-react';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { IPolicy } from '@/utils/interface';

export default function AdminProlicy() {
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [policyToEdit, setPolicyToEdit] = useState<IPolicy | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Fetch policies from API
  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/policies');
      const data = await res.json();
      if (data.success) {
        setPolicies(data.data);
      } else {
        toast({
          title: "Error loading policies",
          description: data.message || "Failed to load policies",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle adding a policy
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Policy added successfully",
        });
        fetchPolicies();
        setFormData({ title: '', description: ''});
        setOpenAddDialog(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add policy",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirming policy deletion
  const confirmDelete = (id: string) => {
    setPolicyToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle deleting a policy
  const handleDelete = async () => {
    if (policyToDelete === null) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/policies/${policyToDelete}`, { 
        method: 'DELETE' 
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Policy deleted successfully",
        });
        fetchPolicies();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete policy",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
      setPolicyToDelete(null);
    }
  };
// Handle editing a policy
const handleEditSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!policyToEdit) return;
  
  setIsLoading(true);
  try {
    const res = await fetch(`/api/policies/${policyToEdit._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
      }),
    });
    
    const data = await res.json();
    
    if (data.success) {
      toast({
        title: "Success",
        description: "Policy updated successfully",
      });
      fetchPolicies();
      setOpenEditDialog(false);
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to update policy",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

// Open edit dialog with policy data
const openEdit = (policy: IPolicy) => {
  setPolicyToEdit(policy);
  setFormData({
    title: policy.title,
    description: policy.description,
  });
  setOpenEditDialog(true);
};

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Policy Management</h1>
        <Button onClick={() => setOpenAddDialog(true)} variant="default">
          <Plus className="mr-2 h-4 w-4" /> Add Policy
        </Button>
      </div>

      {policies.length === 0 && !isLoading ? (
        <Alert>
          <AlertDescription>
            No policies found. Add your first policy to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Policies</CardTitle>
            <CardDescription>
              Manage your policy catalog with this interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy._id}>
                    <TableCell className="font-mono text-xs">
                      {policy._id.substring(0, 8)}...
                    </TableCell>
                   
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(policy._id)}
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
      )}
    {/* Edit Policy Dialog */}
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>
              Update the details for this policy.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {/* Same form fields as Add Dialog */}
              <div className="grid gap-2">
                <Label htmlFor="title">Policy title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>
               
              
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Policy Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Policy</DialogTitle>
            <DialogDescription>
              Enter the details for the new policy below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Policy title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>
              
              
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Policy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this policy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     
    </div>
  );
}