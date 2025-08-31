// pages/admin/projects.tsx
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
import { IProject } from '@/utils/interface';
import NavbarAdmin from '@/components/NavbarAdmin';
// import { SingleImageDropzoneUsage } from '@/components/SingleImageDropzoneUsage';

export default function AdminProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<IProject | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        toast({
          title: "Error loading projects",
          description: data.message || "Failed to load projects",
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
    fetchProjects();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle adding a project
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          image: formData.image,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project added successfully",
        });
        fetchProjects();
        setFormData({ name: '', description: '', image: ''});
        setOpenAddDialog(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add project",
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

  // Handle confirming project deletion
  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle deleting a project
  const handleDelete = async () => {
    if (projectToDelete === null) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, { 
        method: 'DELETE' 
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete project",
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
      setProjectToDelete(null);
    }
  };
// Handle editing a project
const handleEditSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!projectToEdit) return;
  
  setIsLoading(true);
  try {
    const res = await fetch(`/api/projects/${projectToEdit._id}`, {
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
        description: "Project updated successfully",
      });
      fetchProjects();
      setOpenEditDialog(false);
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to update project",
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

// Open edit dialog with project data
const openEdit = (project: IProject) => {
  setProjectToEdit(project);
  setFormData({
    name: project.name,
    description: project.description,
    image: project.image,
  });
  setOpenEditDialog(true);
};

  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý dự án"
        description="Tạo, chỉnh sửa và quản lý các dự án của công ty"
        buttonTool={
          <Button onClick={() => setOpenAddDialog(true)} variant="default">
            <Plus className="mr-2 h-4 w-4" /> Thêm dự án
          </Button>
        }
      />

      <div className="px-4">
        {projects.length === 0 && !isLoading ? (
          <Alert>
            <AlertDescription>
              Không tìm thấy dự án nào. Thêm dự án đầu tiên để bắt đầu.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách dự án</CardTitle>
              <CardDescription>
                Quản lý danh mục dự án với giao diện này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell className="font-mono text-xs">
                        {project._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {project.image && (
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <img 
                              src={project.image} 
                              alt={project.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/api/placeholder/48/48";
                              }}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(project._id)}
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
      </div>

    {/* Edit Project Dialog */}
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the details for this project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {/* Same form fields as Add Dialog */}
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
              <div className="grid gap-2">
                {/* <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  required
                /> */}
                
                {/* <SingleImageDropzoneUsage onUploadSuccess={(url: string) => handleInputChange("image", url)} /> */}
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

      {/* Add Project Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new project below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
              <div className="grid gap-2">
                {/* <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  required
                /> */}
                
                {/* <SingleImageDropzoneUsage onUploadSuccess={(url: string) => handleInputChange("image", url)} /> */}
              </div>
              
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Project"}
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
              Are you sure you want to delete this project? This action cannot be undone.
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