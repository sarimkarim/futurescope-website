import { Category } from "../models/category.model.js";
import { Job } from "../models/job.model.js";

// Create category (Admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required.",
                success: false
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists.",
                success: false
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description?.trim() || ""
        });

        return res.status(201).json({
            message: "Category created successfully.",
            category,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        return res.status(200).json({
            categories: categories || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get categories that have at least one job
export const getCategoriesWithJobs = async (req, res) => {
    try {
        // Get all unique category IDs that have jobs
        const categoriesWithJobs = await Job.distinct("category");
        
        // Get the full category documents
        const categories = await Category.find({
            _id: { $in: categoriesWithJobs }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            categories: categories || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: "Category not found.",
                success: false
            });
        }

        return res.status(200).json({
            category,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found.",
                success: false
            });
        }

        // Check if name is being updated and if it already exists
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.status(400).json({
                    message: "Category name already exists.",
                    success: false
                });
            }
            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        await category.save();

        return res.status(200).json({
            message: "Category updated successfully.",
            category,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};







