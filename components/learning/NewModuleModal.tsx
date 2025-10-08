
import React, { useState, useCallback } from 'react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { LearningModule, QuizQuestion } from '../../types';
import { useLearning } from '../../contexts/LearningContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const NewModuleModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { addModule } = useLearning();
    const [formData, setFormData] = useState<Omit<LearningModule, 'id' | 'progress'>>({
        title: '',
        category: 'Financial Literacy',
        type: 'article',
        duration: '',
        content: {
            summary: '',
            keyTakeaways: [''],
        },
        quiz: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in formData.content) {
            setFormData(prev => ({...prev, content: {...prev.content, [name]: value}}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    content: {
                        ...prev.content,
                        [prev.type === 'image' ? 'imageUrl' : 'fileUrl']: reader.result as string,
                        fileName: file.name
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyTakeawayChange = (index: number, value: string) => {
        const newTakeaways = [...formData.content.keyTakeaways];
        newTakeaways[index] = value;
        setFormData(prev => ({...prev, content: {...prev.content, keyTakeaways: newTakeaways}}));
    };

    const addKeyTakeaway = () => {
        setFormData(prev => ({...prev, content: {...prev.content, keyTakeaways: [...prev.content.keyTakeaways, '']}}));
    };

    const removeKeyTakeaway = (index: number) => {
        setFormData(prev => ({...prev, content: {...prev.content, keyTakeaways: prev.content.keyTakeaways.filter((_, i) => i !== index)}}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addModule(formData);
        onClose();
    };
    
    const renderContentInput = () => {
        switch (formData.type) {
            case 'video':
                return <div><label className="label-text">Video URL</label><input type="url" name="videoUrl" onChange={handleChange} className="input-field" placeholder="https://youtube.com/embed/..."/></div>;
            case 'article':
                return <div><label className="label-text">Article Content</label><textarea name="articleText" onChange={handleChange} rows={5} className="input-field"></textarea></div>;
            case 'image':
                return <div><label className="label-text">Upload Image</label><input type="file" accept="image/*" onChange={handleFileChange} className="input-field"/>{formData.content.imageUrl && <img src={formData.content.imageUrl} className="mt-2 max-h-40 rounded"/>}</div>;
            case 'file':
                return <div><label className="label-text">Upload File</label><input type="file" onChange={handleFileChange} className="input-field"/>{formData.content.fileName && <p className="text-sm mt-1">Uploaded: {formData.content.fileName}</p>}</div>;
            default: return null;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Learning Module">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="label-text">Title</label><input type="text" name="title" onChange={handleChange} required className="input-field"/></div>
                     <div><label className="label-text">Duration</label><input type="text" name="duration" onChange={handleChange} required className="input-field" placeholder="e.g., 45m read"/></div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label-text">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                            <option>Financial Literacy</option>
                            <option>Entrepreneurship</option>
                            <option>Web Development</option>
                            <option>Soft Skills</option>
                            <option>Other</option>
                        </select>
                    </div>
                     <div>
                        <label className="label-text">Content Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                            <option value="article">Article</option>
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                            <option value="file">File</option>
                        </select>
                    </div>
                </div>
                
                <div><label className="label-text">Summary</label><textarea name="summary" onChange={handleChange} required rows={2} className="input-field"></textarea></div>

                {renderContentInput()}

                <div>
                    <label className="label-text">Key Takeaways</label>
                    {formData.content.keyTakeaways.map((takeaway, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={takeaway} onChange={(e) => handleKeyTakeawayChange(index, e.target.value)} className="input-field flex-grow"/>
                            <Button type="button" variant="danger" size="sm" onClick={() => removeKeyTakeaway(index)}><TrashIcon className="h-4 w-4"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={addKeyTakeaway}><PlusIcon className="h-4 w-4 mr-1 inline"/>Add Takeaway</Button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Module</Button>
                </div>
            </form>
        </Modal>
    );
};

export default NewModuleModal;
