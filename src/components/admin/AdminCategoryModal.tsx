import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Category } from '../../types';
import { X } from 'lucide-react';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

/** Admin-only modal for adding a new directory category/taxonomy entry. */
export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const { addCategory } = useDirectory();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon] = useState('ShoppingBag');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: 'cat-' + newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: newCatIcon,
      icon: newCatIcon,
      businessCount: 0,
      description: newCatDesc || 'Local services and shops in Bozeman, Montana.',
      popularServices: ['Consultation', 'Custom Work', 'Repairs'],
      subcategories: ['General', 'Commercial', 'Residential'],
    };
    addCategory(newCat);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Added category: "${newCatName}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="font-heading font-bold text-lg text-stone-900">Add New Category</h3>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Montana Outdoor Gear & Rentals"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Bozeman ski tuning, fly fishing outfitters, backcountry gear..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
