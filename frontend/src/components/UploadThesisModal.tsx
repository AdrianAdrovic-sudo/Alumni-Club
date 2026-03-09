import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface UploadThesisFormData {
    thesisType: 'bachelors' | 'masters' | 'specialist' | '';
    file: File | null;
    title: string;
    year: string;
}

interface ThesisContext {
    id: number;
    first_name: string;
    last_name: string;
    title: string;
    date: string;
    type: string;
    year?: number | string | null;
    fileUrl?: string | null;
}

interface UploadThesisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: () => Promise<void> | void;
    thesisContext?: ThesisContext;
}

const initialFormData: UploadThesisFormData = {
    thesisType: '',
    file: null,
    title: '',
    year: '',
};

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const UploadThesisModal: React.FC<UploadThesisModalProps> = ({
    isOpen,
    onClose,
    onUploadSuccess,
    thesisContext,
}) => {
    const [formData, setFormData] = useState<UploadThesisFormData>(initialFormData);
    const [errors, setErrors] = useState<{
        thesisType?: string;
        file?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentFileUrl = thesisContext?.fileUrl
        ? (thesisContext.fileUrl.startsWith('http://') || thesisContext.fileUrl.startsWith('https://')
            ? thesisContext.fileUrl
            : `${BACKEND_URL}${thesisContext.fileUrl.startsWith('/') ? thesisContext.fileUrl : `/${thesisContext.fileUrl}`}`)
        : '';

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setFormData({
            thesisType: (thesisContext?.type as UploadThesisFormData['thesisType']) || '',
            file: null,
            title: thesisContext?.title || '',
            year: thesisContext?.year ? String(thesisContext.year) : '',
        });
        setErrors({});
    }, [isOpen, thesisContext]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            setFormData((prev) => ({ ...prev, file: null }));
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
            setErrors((prev) => ({ ...prev, file: 'Dozvoljeni su samo PDF fajlovi' }));
            setFormData((prev) => ({ ...prev, file: null }));
            return;
        }

        setErrors((prev) => ({ ...prev, file: undefined }));
        setFormData((prev) => ({ ...prev, file: selectedFile }));
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { thesisType?: string; file?: string } = {};

        if (!formData.thesisType) {
            newErrors.thesisType = 'Tip rada je obavezan';
        }

        if (!formData.file && !currentFileUrl) {
            newErrors.file = 'PDF fajl je obavezan';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!thesisContext?.id) {
            alert('Nije izabran rad za azuriranje');
            return;
        }

        try {
            setIsSubmitting(true);

            const form = new FormData();
            if (formData.file) {
                form.append('file', formData.file);
            }
            form.append('type', formData.thesisType);

            if (formData.title.trim()) {
                form.append('title', formData.title.trim());
            }

            if (formData.year.trim()) {
                form.append('year', formData.year.trim());
            }

            const response = await fetch(`/api/theses/upload-pdf/${thesisContext.id}`, {
                method: 'POST',
                body: form,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload nije uspio');
            }

            await onUploadSuccess?.();
            alert('Rad je uspjesno otpremljen');
            handleClose();
        } catch (error) {
            console.error(error);
            alert('Greska pri uploadu rada');
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Otpremi rad</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Zatvori modal"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {thesisContext && (
                    <div className="px-6 pt-4 pb-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Student:</span> {thesisContext.first_name} {thesisContext.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Originalni rad:</span> {thesisContext.title}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Tip:</span>{' '}
                            {thesisContext.type === 'bachelors' && 'Osnovne studije'}
                            {thesisContext.type === 'masters' && 'Master studije'}
                            {thesisContext.type === 'specialist' && 'Specijalisticke studije'}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label htmlFor="thesisType" className="block text-sm font-semibold text-gray-700 mb-2">
                            Tip rada <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="thesisType"
                            value={formData.thesisType}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    thesisType: e.target.value as UploadThesisFormData['thesisType'],
                                }));
                                setErrors((prev) => ({ ...prev, thesisType: undefined }));
                            }}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-black focus:ring-[#294a70] ${
                                errors.thesisType ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="" className="text-gray-500">Izaberite tip rada...</option>
                            <option value="bachelors" className="text-black">Osnovne studije</option>
                            <option value="masters" className="text-black">Master studije</option>
                            <option value="specialist" className="text-black">Specijalisticke studije</option>
                        </select>
                        {errors.thesisType && (
                            <p className="mt-1 text-sm text-red-500">{errors.thesisType}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
                            Otpremi PDF {!currentFileUrl && <span className="text-red-500">*</span>}
                        </label>
                        {currentFileUrl && !formData.file && (
                            <p className="mb-2 text-sm text-gray-600">
                                Trenutni PDF:{' '}
                                <a
                                    href={currentFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#294a70] hover:underline"
                                >
                                    Otvori trenutno otpremljeni fajl
                                </a>
                            </p>
                        )}
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70] ${
                                errors.file ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formData.file && (
                            <p className="mt-1 text-sm text-green-600">
                                Novi PDF: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                        {currentFileUrl && (
                            <p className="mt-1 text-xs text-gray-500">
                                Ako ne izaberes novi PDF, ostace sacuvan ovaj postojeci fajl.
                            </p>
                        )}
                        {errors.file && (
                            <p className="mt-1 text-sm text-red-500">{errors.file}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Naslov rada <span className="text-gray-400 text-xs">(opciono)</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Unesite naslov rada..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        />
                    </div>

                    <div>
                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                            Godina <span className="text-gray-400 text-xs">(opciono)</span>
                        </label>
                        <input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                            placeholder="npr. 2024"
                            min="1900"
                            max="2100"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                        >
                            Otkazi
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Otpremanje...' : 'Otpremi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadThesisModal;
