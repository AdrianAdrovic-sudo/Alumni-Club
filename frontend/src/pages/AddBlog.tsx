import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddBlog.css';

const AddBlog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        content: '',
        image: '',
        readTime: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add API call to create blog post
        console.log('Blog data:', formData);
        // Navigate back to blog page after submission
        navigate('/Blog');
    };

    const handleCancel = () => {
        navigate('/Blog');
    };

    return (
        <section className="add-blog-section px-[5%] py-16 md:py-24 lg:py-28">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Create New Blog Post</h1>
                    <p className="text-gray-300">Fill in the details below to create a new blog post</p>
                </div>

                <form onSubmit={handleSubmit} className="blog-form bg-white rounded-lg shadow-lg p-8">
                    {/* Title */}
                    <div className="form-group mb-6">
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                            Blog Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group mb-6">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                            <option value="Career">Career</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Image URL */}
                    <div className="form-group mb-6">
                        <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                            Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Read Time */}
                    <div className="form-group mb-6">
                        <label htmlFor="readTime" className="block text-gray-700 font-semibold mb-2">
                            Read Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="readTime"
                            name="readTime"
                            value={formData.readTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 5 min read"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                            Short Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Brief description of the blog post"
                        />
                    </div>

                    {/* Content */}
                    <div className="form-group mb-8">
                        <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
                            Blog Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Write your blog content here..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            Publish Blog
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddBlog;
