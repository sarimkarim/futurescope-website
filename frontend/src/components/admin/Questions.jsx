import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import axios from 'axios'
import { QUESTION_API_END_POINT, CATEGORY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories } from '@/redux/categorySlice'
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useGetAllCategories from '@/hooks/useGetAllCategories'

const Questions = () => {
    useGetAllCategories();
    const dispatch = useDispatch();
    const { categories } = useSelector(store => store.category);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        categoryId: "",
        difficulty: "medium"
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${QUESTION_API_END_POINT}/get`, { withCredentials: true });
            if (res.data.success) {
                setQuestions(res.data.questions || []);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch questions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.question.trim()) {
            toast.error("Question is required");
            return;
        }
        if (!formData.categoryId) {
            toast.error("Please select a category");
            return;
        }
        const validOptions = formData.options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            toast.error("At least 2 options are required");
            return;
        }
        if (formData.correctAnswer === "" || formData.correctAnswer < 0 || formData.correctAnswer >= validOptions.length) {
            toast.error("Please select a valid correct answer");
            return;
        }

        try {
            setEditLoading(true);
            const payload = {
                question: formData.question,
                options: validOptions,
                correctAnswer: Number(formData.correctAnswer),
                categoryId: formData.categoryId,
                difficulty: formData.difficulty
            };

            if (editingQuestion) {
                // Update question
                const res = await axios.put(
                    `${QUESTION_API_END_POINT}/update/${editingQuestion._id}`,
                    payload,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchQuestions();
                    setIsDialogOpen(false);
                    resetForm();
                }
            } else {
                // Create question
                const res = await axios.post(
                    `${QUESTION_API_END_POINT}/create`,
                    payload,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchQuestions();
                    setIsDialogOpen(false);
                    resetForm();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save question");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) {
            return;
        }
        try {
            setDeleteLoading({ [questionId]: true });
            const res = await axios.delete(
                `${QUESTION_API_END_POINT}/delete/${questionId}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                fetchQuestions();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete question");
        } finally {
            setDeleteLoading({ [questionId]: false });
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            question: question.question,
            options: question.options.length >= 4 ? question.options : [...question.options, ...Array(4 - question.options.length).fill("")],
            correctAnswer: question.correctAnswer.toString(),
            categoryId: question.category._id,
            difficulty: question.difficulty || "medium"
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            categoryId: "",
            difficulty: "medium"
        });
        setEditingQuestion(null);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, ""]
        });
    };

    const removeOption = (index) => {
        if (formData.options.length <= 2) {
            toast.error("At least 2 options are required");
            return;
        }
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            options: newOptions,
            correctAnswer: formData.correctAnswer >= newOptions.length ? "" : formData.correctAnswer
        });
    };

    const updateOption = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 md:my-10 px-4'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold'>Manage Questions</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => resetForm()} className="w-full sm:w-auto">
                                <Plus className='mr-2 h-4 w-4' />
                                Add Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2 sm:mx-auto">
                            <DialogHeader>
                                <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                                <DialogDescription>
                                    {editingQuestion ? 'Update question information' : 'Create a new MCQ question for job applications'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className='space-y-4 py-4'>
                                    <div>
                                        <Label>Category *</Label>
                                        <Select
                                            value={formData.categoryId}
                                            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select a Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Question *</Label>
                                        <Input
                                            type="text"
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            placeholder="Enter the question"
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Options *</Label>
                                        {formData.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2 mt-2">
                                                <Input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="flex-1"
                                                />
                                                {formData.options.length > 2 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
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
                                            className="mt-2"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Option
                                        </Button>
                                    </div>
                                    <div>
                                        <Label>Correct Answer *</Label>
                                        <Select
                                            value={formData.correctAnswer}
                                            onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select correct answer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {formData.options.map((option, index) => (
                                                        option.trim() && (
                                                            <SelectItem key={index} value={index.toString()}>
                                                                Option {index + 1}: {option}
                                                            </SelectItem>
                                                        )
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Difficulty</Label>
                                        <Select
                                            value={formData.difficulty}
                                            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            editingQuestion ? 'Update' : 'Create'
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
                    <div className='space-y-4'>
                        {questions.length === 0 ? (
                            <div className='text-center py-10 text-gray-500'>
                                No questions found. Create your first question!
                            </div>
                        ) : (
                            questions.map((question) => (
                                <div
                                    key={question._id}
                                    className='p-5 rounded-md shadow-lg bg-white border border-gray-200'
                                >
                                    <div className='flex items-start justify-between mb-3'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <h3 className='font-bold text-lg'>{question.question}</h3>
                                                <span className='text-xs px-2 py-1 bg-gray-100 rounded'>{question.difficulty}</span>
                                                <span className='text-xs px-2 py-1 bg-blue-100 rounded'>{question.category?.name}</span>
                                            </div>
                                            <div className='space-y-1 ml-4'>
                                                {question.options.map((option, index) => (
                                                    <div key={index} className='text-sm'>
                                                        {index === question.correctAnswer ? (
                                                            <span className='text-green-600 font-semibold'>✓ {option}</span>
                                                        ) : (
                                                            <span className='text-gray-600'>{option}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 mt-4'>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(question)}
                                        >
                                            <Edit className='h-4 w-4 mr-1' />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(question._id)}
                                            disabled={deleteLoading[question._id]}
                                        >
                                            {deleteLoading[question._id] ? (
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

export default Questions

