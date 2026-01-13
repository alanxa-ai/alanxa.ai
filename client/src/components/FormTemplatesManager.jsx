import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FIELD_TYPES = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'url', label: 'URL / Link' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'checkbox-group', label: 'Checkbox Group' },
    { value: 'file', label: 'File Upload' },
    { value: 'country', label: 'Country Picker' },
    { value: 'device', label: 'Device Type' }
];

const FormTemplatesManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fields: [],
        isDefault: false
    });
    
    const [newField, setNewField] = useState({
        fieldId: '',
        label: '',
        type: 'text',
        placeholder: '',
        required: false,
        options: []
    });
    const [optionInput, setOptionInput] = useState('');

    const API_URL = '/api/admin';

    const getAuthHeaders = () => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get(`${API_URL}/form-templates`, getAuthHeaders());
            setTemplates(res.data);
        } catch (error) {
            toast.error('Failed to load form templates');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', fields: [], isDefault: false });
        setNewField({ fieldId: '', label: '', type: 'text', placeholder: '', required: false, options: [] });
        setEditingTemplate(null);
        setShowForm(false);
    };

    const handleAddField = () => {
        if (!newField.label.trim()) {
            toast.error('Field label is required');
            return;
        }
        
        const fieldId = newField.fieldId || newField.label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, { ...newField, fieldId }]
        }));
        
        setNewField({ fieldId: '', label: '', type: 'text', placeholder: '', required: false, options: [] });
        setOptionInput('');
    };

    const handleRemoveField = (index) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index)
        }));
    };

    const handleAddOption = () => {
        if (!optionInput.trim()) return;
        setNewField(prev => ({
            ...prev,
            options: [...prev.options, optionInput.trim()]
        }));
        setOptionInput('');
    };

    const handleRemoveOption = (index) => {
        setNewField(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Template name is required');
            return;
        }

        try {
            if (editingTemplate) {
                await api.put(`${API_URL}/form-templates/${editingTemplate._id}`, formData, getAuthHeaders());
                toast.success('Template updated');
            } else {
                await api.post(`${API_URL}/form-templates`, formData, getAuthHeaders());
                toast.success('Template created');
            }
            fetchTemplates();
            resetForm();
        } catch (error) {
            toast.error('Failed to save template');
        }
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            description: template.description || '',
            fields: template.fields || [],
            isDefault: template.isDefault || false
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this form template?')) return;
        
        try {
            await api.delete(`${API_URL}/form-templates/${id}`, getAuthHeaders());
            toast.success('Template deleted');
            fetchTemplates();
        } catch (error) {
            toast.error('Failed to delete template');
        }
    };

    const moveField = (index, direction) => {
        const newFields = [...formData.fields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newFields.length) return;
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        setFormData(prev => ({ ...prev, fields: newFields }));
    };

    if (loading) {
        return <div className="text-white text-center py-20">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Form Templates</h2>
                    <p className="text-gray-400 text-sm mt-1">Create custom application forms for different job types</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> New Template
                </button>
            </div>

            {/* Form Builder */}
            {showForm && (
                <div className="bg-[#0A0F1C] border border-gray-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">
                            {editingTemplate ? 'Edit Template' : 'Create New Template'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">Template Name *</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500"
                                    placeholder="e.g., Data Annotator Application"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-2">Description</label>
                                <input 
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-indigo-500"
                                    placeholder="Brief description of this form"
                                />
                            </div>
                        </div>

                        {/* Current Fields */}
                        {formData.fields.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Form Fields ({formData.fields.length})</label>
                                <div className="space-y-2">
                                    {formData.fields.map((field, index) => (
                                        <div key={field.fieldId} className="flex items-center gap-3 bg-[#1E293B] p-3 rounded-lg border border-gray-700">
                                            <div className="flex flex-col gap-1">
                                                <button type="button" onClick={() => moveField(index, 'up')} className="text-gray-500 hover:text-white" disabled={index === 0}>
                                                    <ChevronUp size={14} />
                                                </button>
                                                <button type="button" onClick={() => moveField(index, 'down')} className="text-gray-500 hover:text-white" disabled={index === formData.fields.length - 1}>
                                                    <ChevronDown size={14} />
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-white font-medium">{field.label}</span>
                                                <span className="ml-2 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{field.type}</span>
                                                {field.required && <span className="ml-2 text-xs text-red-400">Required</span>}
                                            </div>
                                            <button type="button" onClick={() => handleRemoveField(index)} className="text-red-400 hover:text-red-300">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Field Section */}
                        <div className="border border-dashed border-gray-700 rounded-xl p-4 bg-black/30">
                            <label className="block text-sm font-bold text-indigo-400 mb-4">+ Add Field</label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <input 
                                    type="text"
                                    value={newField.label}
                                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                                    className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500"
                                    placeholder="Field Label"
                                />
                                <select 
                                    value={newField.type}
                                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value, options: [] }))}
                                    className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500"
                                >
                                    {FIELD_TYPES.map(ft => (
                                        <option key={ft.value} value={ft.value}>{ft.label}</option>
                                    ))}
                                </select>
                                <input 
                                    type="text"
                                    value={newField.placeholder}
                                    onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                                    className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-indigo-500"
                                    placeholder="Placeholder text"
                                />
                                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={newField.required}
                                        onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                                        className="accent-indigo-600"
                                    />
                                    Required
                                </label>
                            </div>

                            {/* Options for select/checkbox-group */}
                            {(newField.type === 'select' || newField.type === 'checkbox-group') && (
                                <div className="mt-4">
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Options</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {newField.options.map((opt, i) => (
                                            <span key={i} className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">
                                                {opt}
                                                <button type="button" onClick={() => handleRemoveOption(i)} className="hover:text-red-400">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={optionInput}
                                            onChange={(e) => setOptionInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                                            className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm outline-none"
                                            placeholder="Type option and press Enter"
                                        />
                                        <button type="button" onClick={handleAddOption} className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="button" 
                                onClick={handleAddField}
                                className="mt-4 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-600/30 transition"
                            >
                                + Add This Field
                            </button>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3">
                            <button 
                                type="submit"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                <Save size={18} /> {editingTemplate ? 'Update Template' : 'Save Template'}
                            </button>
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Templates List */}
            <div className="bg-[#0A0F1C] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="font-bold text-white">Saved Templates ({templates.length})</h3>
                </div>
                
                {templates.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No form templates yet. Create your first one!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {templates.map(template => (
                            <div key={template._id} className="p-6 hover:bg-[#1E293B]/50 transition flex justify-between items-center">
                                <div>
                                    <h4 className="text-white font-bold">{template.name}</h4>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {template.fields?.length || 0} fields
                                        {template.description && ` • ${template.description}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(template)}
                                        className="p-2 text-white hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(template._id)}
                                        className="p-2 text-white hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormTemplatesManager;
