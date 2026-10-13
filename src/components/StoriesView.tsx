import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { BusinessStory } from '../types';
import { BookOpen, ArrowRight, User, X } from 'lucide-react';

export const StoriesView: React.FC = () => {
  const { stories, openBusinessProfile } = useDirectory();
  const [selectedStory, setSelectedStory] = useState<BusinessStory | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <BookOpen size={14} className="text-amber-600" />
          <span>Gallatin Valley Editorial</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
          Stories Behind Bozeman Businesses
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          The craftsmen, restaurateurs, guides, and independent founders who shape the character and resilience of our mountain community.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <img
                  src={story.coverUrl}
                  alt={story.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-2">
                  <span>{story.publishDate}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                </div>

                <h2 className="font-heading font-bold text-lg text-stone-900 mb-2 leading-snug">
                  {story.title}
                </h2>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                  {story.subtitle}
                </p>

                <div className="flex items-center gap-2 text-xs text-stone-500 border-t border-stone-100 pt-3">
                  <User size={13} className="text-stone-400" />
                  <span>By {story.author}</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedStory(story)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <span>Read Story</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Story Reader Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X size={20} />
            </button>

            <img
              src={selectedStory.coverUrl}
              alt={selectedStory.title}
              className="w-full h-64 rounded-xl object-cover mb-6"
            />

            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span>{selectedStory.publishDate} • {selectedStory.readTime}</span>
              <span>By {selectedStory.author}</span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl text-stone-900 mb-4 leading-tight">
              {selectedStory.title}
            </h2>

            <div className="text-stone-700 text-sm leading-relaxed space-y-4 mb-8">
              {selectedStory.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Featured Business: <strong>{selectedStory.businessName}</strong>
              </span>
              <button
                onClick={() => {
                  const bId = selectedStory.businessId;
                  setSelectedStory(null);
                  openBusinessProfile(bId);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                View Business Profile →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
