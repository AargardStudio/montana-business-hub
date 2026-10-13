import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { AdminCategoryModal } from './AdminCategoryModal';

interface AdminCategoriesSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Categories" tab: taxonomy management for search filtering and
 * navigation, plus the add-category modal.
 */
export const AdminCategoriesSection: React.FC<AdminCategoriesSectionProps> = ({ showToast }) => {
  const { categories, businesses, deleteCategory } = useDirectory();
  const [catModalOpen, setCatModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Directory Categories & Taxonomy ({categories.length})
          </h3>
          <p className="text-xs text-stone-500">
            Configure primary categories for search filtering and navigation chips.
          </p>
        </div>
        <button
          onClick={() => setCatModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => {
          const count = businesses.filter((b) => b.categoryId === c.id).length;
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading font-bold text-stone-900 text-sm">{c.name}</h4>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                    {count} businesses
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-2">{c.description}</p>
                <span className="text-[10px] text-stone-400 font-mono">ID: {c.id}</span>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm(`Remove category "${c.name}"?`)) {
                      deleteCategory(c.id);
                      showToast(`Category "${c.name}" removed.`);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AdminCategoryModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};
