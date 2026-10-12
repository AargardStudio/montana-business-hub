import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { BookOpen, Building, ArrowRight, User, Calendar, X } from 'lucide-react';

export const StoriesView: React.FC = () => {
  const { businesses, openBusinessProfile } = useDirectory();
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  const STORIES = [
    {
      id: 'story-1',
      businessId: 'biz-woodworking-1',
      businessName: 'Montana Craft Woodworking',
      title: 'Reviving Timber Frame Heritage in Gallatin Valley',
      author: 'Marcus Vance',
      date: 'September 15, 2026',
      readTime: '4 min read',
      coverUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
      excerpt:
        'How master carpenter David Ross transitioned from high-volume subdivision framing to handcrafted Douglas fir post-and-beam construction that withstands Montana mountain winters.',
      fullContent: `When David Ross first moved to Gallatin County in 2011, he saw hundreds of new subdivisions going up with cookie-cutter trusses and synthetic trims. Having apprenticed under master timber joiners in the Pacific Northwest, David felt something essential was missing in the modern construction boom: longevity, soul, and authentic craftsmanship.

"A true timber frame doesn't just shelter a family for thirty years," David reflects inside his 6,000-square-foot workshop in the Cannery District. "It becomes an heirloom that stands through high-elevation blizzards, seismic shifts, and generational handovers."

Today, Montana Craft Woodworking employs six full-time Bozeman artisans, sourcing dead-standing lodgepole pine and certified sustainable Douglas fir. Every joint is cut by hand with traditional mortise-and-tenon connections secured with oak pegs, without metal hardware visible from the living quarters.

Beyond custom residences, David has committed 5% of his shop's capacity to restoring historic barns across the Shields and Gallatin valleys, preserving the architectural memory of Montana's agricultural pioneers.`,
    },
    {
      id: 'story-2',
      businessId: 'biz-restaurant-1',
      businessName: 'Blackbird Kitchen & Bar',
      title: 'The Art of 72-Hour Fermentation and Wood Smoke on Main Street',
      author: 'Sarah Jenkins',
      date: 'August 28, 2026',
      readTime: '3 min read',
      coverUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      excerpt:
        'Inside the nightly rhythm of Bozeman’s favorite wood-fired dining room, where local heritage grains meet alpine Italian technique.',
      fullContent: `The scent of burning applewood and stone-milled organic flour has greeted late-afternoon walkers on Bozeman's historic Main Street for over a decade. At Blackbird Kitchen & Bar, the hearth isn't merely an appliance—it is the living heart of the restaurant.

Head Chef Elena Rossi began baking bread before dawn alongside Gallatin Valley wheat growers. "Montana grows some of the highest-protein durum and hard red winter wheats on earth," Elena explains while inspecting a bubbling naturally leavened dough. "When you pair that grain with a three-day cold fermentation and a 900-degree oven floor, you unlock flavors that commercial yeast could never hope to approximate."

Every season, Blackbird collaborates directly with ranchers in Belgrade and organic produce growers along the Madison River. Their handmade pasta program changes weekly depending on what greens, wild chanterelles, or huckleberries the surrounding mountains offer.`,
    },
    {
      id: 'story-3',
      businessId: 'biz-outdoor-1',
      businessName: 'Bridger Mountain Outfitters',
      title: 'Forty Years of Guiding the Madison and Yellowstone Rivers',
      author: 'Tyler Cole',
      date: 'July 14, 2026',
      readTime: '5 min read',
      coverUrl:
        'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=1200&auto=format&fit=crop&q=80',
      excerpt:
        'From hand-tied caddis flies to wilderness avalanche safety: how one local gear institution fostered stewardship across four decades.',
      fullContent: `Founded in 1984 during the dawn of modern fly fishing in Montana, Bridger Mountain Outfitters has stood as a beacon for outdoor enthusiasts traversing Gallatin Gateway.

Founder Mark Gallagher still begins his mornings inspecting the stream gauges on the Gallatin, Madison, and Yellowstone rivers. "Anyone can sell a pair of waders," Gallagher chuckles. "What matters is knowing which tributary is running turbid from snowmelt, which gravel bar holds cutthroat during an August hopper hatch, and teaching newcomers how to practice catch-and-release without stressing the wild fishery."

Bridger Mountain Outfitters has expanded from a modest wooden shed to a premiere backcountry ski tuning, mountain bike outfitter, and fly shop, remaining 100% locally owned and actively funding trout stream restoration projects.`,
    },
  ];

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
        {STORIES.map((story) => (
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
                  <span>{story.date}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                </div>

                <h2 className="font-heading font-bold text-lg text-stone-900 mb-2 leading-snug">
                  {story.title}
                </h2>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                  {story.excerpt}
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
              <span>{selectedStory.date} • {selectedStory.readTime}</span>
              <span>By {selectedStory.author}</span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl text-stone-900 mb-4 leading-tight">
              {selectedStory.title}
            </h2>

            <div className="text-stone-700 text-sm leading-relaxed space-y-4 whitespace-pre-line mb-8">
              {selectedStory.fullContent}
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
