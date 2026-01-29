'use client';

import { useState, useRef } from 'react';

interface CloudinaryUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
    folder?: string;
    className?: string;
}

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export default function CloudinaryUpload({
    value = [],
    onChange,
    maxFiles = 5,
    folder = 'waqf',
    className = '',
}: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            setError('Configuration Cloudinary manquante. Vérifiez les variables d\'environnement.');
            return;
        }

        const remainingSlots = maxFiles - value.length;
        if (remainingSlots <= 0) {
            setError(`Maximum ${maxFiles} images autorisées`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setUploading(true);
        setError('');

        try {
            const uploadPromises = filesToUpload.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                formData.append('folder', folder);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'upload');
                }

                const data: CloudinaryResponse = await response.json();
                return data.secure_url;
            });

            const newUrls = await Promise.all(uploadPromises);
            onChange([...value, ...newUrls]);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Erreur lors de l\'upload des images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (index: number) => {
        const newUrls = value.filter((_, i) => i !== index);
        onChange(newUrls);
    };

    const handleUrlInput = (url: string, index: number) => {
        const newUrls = [...value];
        newUrls[index] = url;
        onChange(newUrls);
    };

    const addUrlField = () => {
        if (value.length < maxFiles) {
            onChange([...value, '']);
        }
    };

    return (
        <div className={className}>
            {/* Image Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative group">
                            {url ? (
                                <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleUrlInput(e.target.value, index)}
                                        placeholder="URL de l'image"
                                        className="w-full h-full p-2 text-xs text-center bg-transparent outline-none"
                                    />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {value.length < maxFiles && (
                <div className="space-y-3">
                    {/* Drag & Drop / Click to Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                            uploading
                                ? 'border-emerald-300 bg-emerald-50'
                                : 'border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleUpload(e.target.files)}
                            className="hidden"
                        />
                        {uploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-emerald-600 font-medium">Upload en cours...</span>
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl mb-2">📷</div>
                                <div className="text-sm font-medium text-neutral-700">
                                    Cliquez ou glissez des images ici
                                </div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    PNG, JPG, WEBP jusqu&apos;à 10MB • Max {maxFiles} images
                                </div>
                            </>
                        )}
                    </div>

                    {/* Or add URL manually */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-xs text-neutral-400">ou</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                    </div>

                    <button
                        type="button"
                        onClick={addUrlField}
                        className="w-full py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        + Ajouter une URL d&apos;image
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {/* Info about Cloudinary config */}
            {(!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) && (
                <div className="mt-3 p-3 bg-amber-50 text-amber-700 text-sm rounded-lg">
                    ⚠️ Configuration Cloudinary manquante. Ajoutez <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> et <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> dans votre fichier <code>.env.local</code>
                </div>
            )}
        </div>
    );
}
