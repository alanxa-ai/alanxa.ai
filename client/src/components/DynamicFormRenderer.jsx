import React, { useState, useEffect } from 'react';
import { Upload, Check, MapPin, Smartphone } from 'lucide-react';

// Country list for country picker
const COUNTRIES = [
    'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 
    'Spain', 'Italy', 'Brazil', 'Mexico', 'Japan', 'China', 'South Korea', 'Philippines',
    'Pakistan', 'Bangladesh', 'Indonesia', 'Nigeria', 'Egypt', 'South Africa', 'Kenya',
    'UAE', 'Saudi Arabia', 'Russia', 'Ukraine', 'Poland', 'Netherlands', 'Other'
];

// Device options
const DEVICE_OPTIONS = ['Android Phone', 'iPhone', 'Android Tablet', 'iPad', 'Laptop/PC', 'Other'];

const DynamicFormRenderer = ({ 
    fields, 
    formData, 
    setFormData, 
    resumeFile, 
    setResumeFile 
}) => {
    
    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleCheckboxChange = (fieldId, option, checked) => {
        const current = formData[fieldId] || [];
        const updated = checked 
            ? [...current, option]
            : current.filter(v => v !== option);
        setFormData(prev => ({ ...prev, [fieldId]: updated }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const renderField = (field) => {
        const baseInputClasses = "w-full px-4 py-3.5 text-sm rounded-xl bg-black border border-gray-700 text-white focus:bg-[#0A0F1C] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-600";
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
                return (
                    <input 
                        type={field.type === 'phone' ? 'tel' : field.type}
                        name={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={baseInputClasses}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                    />
                );
                
            case 'textarea':
                return (
                    <textarea 
                        name={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={`${baseInputClasses} min-h-[100px] resize-y`}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                    />
                );
                
            case 'select':
                const hasOtherOption = (field.options || []).includes('Other');
                return (
                    <div className="space-y-2">
                        <select
                            name={field.fieldId}
                            value={formData[field.fieldId] || ''}
                            onChange={(e) => handleChange(field.fieldId, e.target.value)}
                            className={baseInputClasses}
                            required={field.required}
                        >
                            <option value="">{field.placeholder || 'Select...'}</option>
                            {(field.options || []).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                        {formData[field.fieldId] === 'Other' && (
                            <input 
                                type="text"
                                name={`${field.fieldId}_other`}
                                value={formData[`${field.fieldId}_other`] || ''}
                                onChange={(e) => handleChange(`${field.fieldId}_other`, e.target.value)}
                                className={baseInputClasses}
                                placeholder="Please specify..."
                            />
                        )}
                    </div>
                );
                
            case 'checkbox-group':
                const selectedValues = formData[field.fieldId] || [];
                const hasOtherCheckbox = (field.options || []).includes('Other');
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(field.options || []).map((opt, i) => (
                                <label 
                                    key={i} 
                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                        selectedValues.includes(opt) 
                                            ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500' 
                                            : 'bg-black border-gray-700 hover:bg-[#1E293B] text-white'
                                    }`}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={selectedValues.includes(opt)}
                                        onChange={(e) => handleCheckboxChange(field.fieldId, opt, e.target.checked)}
                                        className="accent-indigo-600 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold">{opt}</span>
                                </label>
                            ))}
                        </div>
                        {selectedValues.includes('Other') && (
                            <input 
                                type="text"
                                name={`${field.fieldId}_other`}
                                value={formData[`${field.fieldId}_other`] || ''}
                                onChange={(e) => handleChange(`${field.fieldId}_other`, e.target.value)}
                                className={baseInputClasses}
                                placeholder="Please specify other..."
                            />
                        )}
                    </div>
                );
                
            case 'file':
                return (
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-black ${
                        resumeFile ? 'border-indigo-500 bg-indigo-900/10' : 'border-gray-700 hover:border-indigo-500 hover:bg-[#1E293B]'
                    }`}>
                        <input 
                            id={`file-${field.fieldId}`}
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor={`file-${field.fieldId}`} className="cursor-pointer block group">
                            {resumeFile ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-green-900/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-white text-sm">{resumeFile.name}</span>
                                    <span className="text-xs text-green-400 mt-1">Ready to upload</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-[#1E293B] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                        <Upload className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <span className="text-base font-bold text-white">{field.placeholder || 'Upload File'}</span>
                                    <span className="text-xs text-white mt-1">PDF, DOCX up to 5MB</span>
                                </div>
                            )}
                        </label>
                    </div>
                );
                
            case 'country':
                return (
                    <div className="space-y-2">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <select
                                name={field.fieldId}
                                value={formData[field.fieldId] || ''}
                                onChange={(e) => handleChange(field.fieldId, e.target.value)}
                                className={`${baseInputClasses} pl-10`}
                                required={field.required}
                            >
                                <option value="">Select Country...</option>
                                {COUNTRIES.map((country, i) => (
                                    <option key={i} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        {formData[field.fieldId] === 'Other' && (
                            <input 
                                type="text"
                                name={`${field.fieldId}_other`}
                                value={formData[`${field.fieldId}_other`] || ''}
                                onChange={(e) => handleChange(`${field.fieldId}_other`, e.target.value)}
                                className={baseInputClasses}
                                placeholder="Enter your country..."
                            />
                        )}
                    </div>
                );
                
            case 'device':
                return (
                    <div className="space-y-2">
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <select
                                name={field.fieldId}
                                value={formData[field.fieldId] || ''}
                                onChange={(e) => handleChange(field.fieldId, e.target.value)}
                                className={`${baseInputClasses} pl-10`}
                                required={field.required}
                            >
                                <option value="">Select Device...</option>
                                {DEVICE_OPTIONS.map((device, i) => (
                                    <option key={i} value={device}>{device}</option>
                                ))}
                            </select>
                        </div>
                        {formData[field.fieldId] === 'Other' && (
                            <input 
                                type="text"
                                name={`${field.fieldId}_other`}
                                value={formData[`${field.fieldId}_other`] || ''}
                                onChange={(e) => handleChange(`${field.fieldId}_other`, e.target.value)}
                                className={baseInputClasses}
                                placeholder="Enter your device..."
                            />
                        )}
                    </div>
                );
                
            default:
                return (
                    <input 
                        type="text"
                        name={field.fieldId}
                        value={formData[field.fieldId] || ''}
                        onChange={(e) => handleChange(field.fieldId, e.target.value)}
                        className={baseInputClasses}
                        placeholder={field.placeholder || ''}
                    />
                );
        }
    };

    // Group fields into pairs for grid layout (except for special types)
    const groupedFields = [];
    let currentRow = [];
    
    fields.forEach(field => {
        const isFullWidth = ['textarea', 'checkbox-group', 'file'].includes(field.type);
        
        if (isFullWidth) {
            if (currentRow.length > 0) {
                groupedFields.push(currentRow);
                currentRow = [];
            }
            groupedFields.push([field]);
        } else {
            currentRow.push(field);
            if (currentRow.length === 2) {
                groupedFields.push(currentRow);
                currentRow = [];
            }
        }
    });
    
    if (currentRow.length > 0) {
        groupedFields.push(currentRow);
    }

    return (
        <div className="space-y-6">
            {groupedFields.map((row, rowIndex) => {
                const isFullWidth = row.length === 1 && ['textarea', 'checkbox-group', 'file'].includes(row[0].type);
                
                return (
                    <div 
                        key={rowIndex} 
                        className={isFullWidth ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'}
                    >
                        {row.map(field => (
                            <div key={field.fieldId} className="space-y-2">
                                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                    {field.label}
                                    {field.required && <span className="text-red-400">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicFormRenderer;
