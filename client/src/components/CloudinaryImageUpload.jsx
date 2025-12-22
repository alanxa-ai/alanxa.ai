import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

/**
 * CloudinaryImageUpload Component
 * 
 * Upload images to Cloudinary using unsigned upload preset.
 * Configured via .env variables:
 * - VITE_CLOUDINARY_CLOUD_NAME
 * - VITE_CLOUDINARY_UPLOAD_PRESET
 */

const CloudinaryImageUpload = ({ onUploadSuccess, folder = 'alanxa' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  // Cloudinary Configuration from Environment Variables
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        setError('Missing Cloudinary configuration. Please check your .env file.');
        return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const imageUrl = response.data.secure_url;
      console.log('Image uploaded successfully:', imageUrl);
      
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }

      setUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      
      // Detailed error handling
      let errorMessage = 'Upload failed. Please try again.';
      if (err.response) {
          if (err.response.status === 401) {
              errorMessage = 'Authentication Error: Please check if your "Upload Preset" is set to "Unsigned" in Cloudinary settings.';
          } else if (err.response.data?.error?.message) {
              errorMessage = `Cloudinary Error: ${err.response.data.error.message}`;
          }
      }
      
      setError(errorMessage);
      setUploading(false);
      // Keep preview so user can retry or see what they picked
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError('');
  };

  return (
    <div className="cloudinary-upload w-full">
      {!preview ? (
        <div className="border-2 border-dashed border-gray-800 bg-[#0A0F1C]/50 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-[#0A0F1C] transition-all duration-300 group">
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <Loader className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                  <p className="text-white font-bold">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-indigo-900/20 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-white font-bold mb-1">Click to upload image</p>
                  <p className="text-white text-sm">PNG, JPG, GIF (Max 5MB)</p>
                  <div className="mt-4 px-6 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-sm font-semibold text-white hover:bg-gray-700 transition-colors">
                      Choose File
                  </div>
                </>
              )}
            </div>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden border border-gray-800">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
               <button
                type="button"
                onClick={clearPreview}
                className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition shadow-lg transform hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5" />
              </button>
          </div>
          
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader className="w-12 h-12 text-white animate-spin mb-3" />
              <p className="text-white font-bold tracking-wide">Uploading...</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-red-300 text-sm font-medium">{error}</div>
        </div>
      )}

      {preview && !uploading && !error && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-900/50 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="p-1 bg-green-900/50 rounded-full">
             <ImageIcon className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-green-400 text-sm font-bold">Image ready</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;
