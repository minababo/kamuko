import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function ImageUploader({ currentImageUrl, onImageUpload }) {
    const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('image', file);

            // Upload to API
            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadedUrl = response.data.url || response.data.imageUrl;
            setImageUrl(uploadedUrl);
            onImageUpload(uploadedUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setImageUrl('');
        onImageUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mt-1">
            {imageUrl ? (
                <div className="relative inline-block">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-48 w-48 rounded-lg object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${dragActive
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mb-3 h-12 w-12 text-gray-400"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">
                                    Click to upload or drag and drop
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}

export default ImageUploader;
