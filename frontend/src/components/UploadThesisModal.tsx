import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface UploadThesisFormData {
    thesisType: 'bachelors' | 'masters' | 'specialist' | '';
    file: File | null;
    title: string;
    year: string;
}

interface UploadThesisModalProps {
    isOpen: boolean;
    onClose: () => void;
    thesisContext?: {
        ime: string;
        prezime: string;
        naziv: string;
        datum: string;
        type: string;
    };
}

const UploadThesisModal: React.FC<UploadThesisModalProps> = ({ isOpen, onClose, thesisContext }) => {
    const [formData, setFormData] = useState<UploadThesisFormData>({
        thesisType: '',
        file: null,
        title: '',
        year: '',
    });

    const [errors, setErrors] = useState<{
        thesisType?: string;
        file?: string;
    }>({});

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            // Validate PDF file type
            if (selectedFile.type !== 'application/pdf') {
                setErrors(prev => ({ ...prev, file: 'Only PDF files are allowed' }));
                setFormData(prev => ({ ...prev, file: null }));
                return;
            }

            setErrors(prev => ({ ...prev, file: undefined }));
            setFormData(prev => ({ ...prev, file: selectedFile }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const newErrors: { thesisType?: string; file?: string } = {};

        if (!formData.thesisType) {
            newErrors.thesisType = 'Thesis type is required';
        }

        if (!formData.file) {
            newErrors.file = 'PDF file is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Prepare data for console output
        const outputData = {
            thesisType: formData.thesisType,
            file: formData.file,
            fileName: formData.file?.name,
            fileSize: formData.file?.size,
            ...(formData.title && { title: formData.title }),
            ...(formData.year && { year: parseInt(formData.year) }),
            ...(thesisContext && { selectedThesis: thesisContext }),
        };

        console.log('=== Upload Thesis Form Submission ===');
        console.log(outputData);
        console.log('=====================================');

        // Reset form and close modal
        setFormData({
            thesisType: '',
            file: null,
            title: '',
            year: '',
        });
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        // Reset form on close
        setFormData({
            thesisType: '',
            file: null,
            title: '',
            year: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Upload Thesis</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Context Info (if provided) */}
                {thesisContext && (
                    <div className="px-6 pt-4 pb-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Student:</span> {thesisContext.ime} {thesisContext.prezime}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Original Thesis:</span> {thesisContext.naziv}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Type:</span>{' '}
                            {thesisContext.type === 'bachelors' && 'Bachelor\'s thesis'}
                            {thesisContext.type === 'masters' && 'Master\'s thesis'}
                            {thesisContext.type === 'specialist' && 'Specialist thesis'}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Thesis Type - Required */}
                    <div>
                        <label htmlFor="thesisType" className="block text-sm font-semibold text-gray-700 mb-2">
                            Thesis Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="thesisType"
                            value={formData.thesisType}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, thesisType: e.target.value as any }));
                                setErrors(prev => ({ ...prev, thesisType: undefined }));
                            }}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-black focus:ring-[#294a70] ${errors.thesisType ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="" className="text-gray-500">Select thesis type...</option>
                            <option value="bachelors" className="text-black">Bachelor's thesis</option>
                            <option value="masters" className="text-black">Master's thesis</option>
                            <option value="specialist" className="text-black">Specialist thesis</option>
                        </select>
                        {errors.thesisType && (
                            <p className="mt-1 text-sm text-red-500">{errors.thesisType}</p>
                        )}
                    </div>

                    {/* File Upload - Required */}
                    <div>
                        <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload PDF <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70] ${errors.file ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {formData.file && (
                            <p className="mt-1 text-sm text-green-600">
                                Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        {errors.file && (
                            <p className="mt-1 text-sm text-red-500">{errors.file}</p>
                        )}
                    </div>

                    {/* Thesis Title - Optional */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Thesis Title <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter thesis title..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        />
                    </div>

                    {/* Year - Optional */}
                    <div>
                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                            Year <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                            placeholder="e.g., 2024"
                            min="1900"
                            max="2100"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors font-medium"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadThesisModal;
