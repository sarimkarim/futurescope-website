import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import axios from 'axios'
import { CATEGORY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories, addCategory, updateCategory, removeCategory } from '@/redux/categorySlice'
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'

const Categories = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(store => store.category);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${CATEGORY_API_END_POINT}/get`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setCategories(res.data.categories || []));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                // Update category
                setEditLoading(true);
                const res = await axios.put(
                    `${CATEGORY_API_END_POINT}/update/${editingCategory._id}`,
                    formData,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    dispatch(updateCategory(res.data.category));
                    setIsDialogOpen(false);
                    resetForm();
                }
            } else {
                // Create category
                setEditLoading(true);
                const res = await axios.post(
                    `${CATEGORY_API_END_POINT}/create`,
                    formData,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    dispatch(addCategory(res.data.category));
                    setIsDialogOpen(false);
                    resetForm();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save category");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }
        try {
            setDeleteLoading({ [categoryId]: true });
            const res = await axios.delete(
                `${CATEGORY_API_END_POINT}/delete/${categoryId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(removeCategory(categoryId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete category");
        } finally {
            setDeleteLoading({ [categoryId]: false });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ""
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setEditingCategory(null);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-3xl font-bold'>Manage Categories</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => resetForm()}>
                                <Plus className='mr-2 h-4 w-4' />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                                <DialogDescription>
                                    {editingCategory ? 'Update category information' : 'Create a new job category'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className='space-y-4 py-4'>
                                    <div>
                                        <Label>Category Name</Label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Frontend Developer"
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Description (Optional)</Label>
                                        <Input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Category description"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDialogClose}
                                        disabled={editLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={editLoading}>
                                        {editLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Saving...
                                            </>
                                        ) : (
                                            editingCategory ? 'Update' : 'Create'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className='flex items-center justify-center py-10'>
                        <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {categories.length === 0 ? (
                            <div className='col-span-full text-center py-10 text-gray-500'>
                                No categories found. Create your first category!
                            </div>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className='p-5 rounded-md shadow-lg bg-white border border-gray-200'
                                >
                                    <div className='flex items-start justify-between mb-3'>
                                        <div className='flex-1'>
                                            <h3 className='font-bold text-lg'>{category.name}</h3>
                                            {category.description && (
                                                <p className='text-sm text-gray-600 mt-1'>{category.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 mt-4'>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <Edit className='h-4 w-4 mr-1' />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(category._id)}
                                            disabled={deleteLoading[category._id]}
                                        >
                                            {deleteLoading[category._id] ? (
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                            ) : (
                                                <>
                                                    <Trash2 className='h-4 w-4 mr-1' />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Categories







