import React, { useState } from 'react';
import { Upload, X, FileText, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

/**
 * CloudinaryResumeUpload Component
 * 
 * Upload resumes (PDF, DOC, DOCX) to Cloudinary.
 */

const CloudinaryResumeUpload = ({ onUploadSuccess, folder = 'alanxa/resumes' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileData, setFileData] = useState(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a PDF or Word document');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }

      setFileData({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
      
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
      formData.append('resource_type', 'auto'); // Important for non-image files
      
      // Use 'auto' or 'raw' for documents
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const fileUrl = response.data.secure_url;
      console.log('File uploaded successfully:', fileUrl);
      
      if (onUploadSuccess) {
        onUploadSuccess(fileUrl);
      }

      setUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Upload failed. Please try again.';
      if (err.response) {
          if (err.response.status === 401) {
              errorMessage = 'Authentication Error: Please check if your "Upload Preset" settings.';
          } else if (err.response.data?.error?.message) {
              errorMessage = `Cloudinary Error: ${err.response.data.error.message}`;
          }
      }
      
      setError(errorMessage);
      setUploading(false);
      setFileData(null);
    }
  };

  const clearFile = () => {
    setFileData(null);
    setError('');
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
    
    // Notify parent that resume is cleared
    if (onUploadSuccess) {
        onUploadSuccess(''); 
    }
  };

  return (
    <div className="cloudinary-upload w-full">
      {!fileData ? (
        <div className="border-2 border-dashed border-gray-800 bg-[#0A0F1C]/50 rounded-xl p-6 text-center hover:border-indigo-500 hover:bg-[#0A0F1C] transition-all duration-300 group">
          <label htmlFor="resume-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <Loader className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                  <p className="text-white font-bold">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-indigo-900/20 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-white font-bold mb-1">Upload Resume</p>
                  <p className="text-white text-xs">PDF, DOC, DOCX (Max 10MB)</p>
                </>
              )}
            </div>
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        <div className="relative group rounded-xl border border-gray-800 bg-[#0A0F1C] p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-900/20 rounded-lg">
             <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="font-bold text-white truncate">{fileData.name}</p>
             <p className="text-xs text-white">{fileData.size}</p>
          </div>
          
          {uploading ? (
             <Loader className="w-5 h-5 text-indigo-500 animate-spin" />
          ) : (
             <div className="flex items-center gap-2">
                 <div className="text-green-400 flex items-center gap-1 text-xs font-bold bg-green-900/20 px-2 py-1 rounded-full border border-green-900/30">
                     <CheckCircle className="w-3 h-3" /> Uploaded
                 </div>
                 <button
                    type="button"
                    onClick={clearFile}
                    className="p-1 text-white hover:text-red-400 hover:bg-red-900/20 rounded-full transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
             </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="text-red-300 text-xs font-medium">{error}</div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryResumeUpload;
