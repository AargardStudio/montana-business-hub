import React from 'react';
import { DirectoryProvider, useDirectory } from './context/DirectoryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BusinessDirectory } from './components/BusinessDirectory';
import { BusinessProfileView } from './components/BusinessProfileView';
import { CategoriesView } from './components/CategoriesView';
import { DigitalShopView } from './components/DigitalShopView';
import { EventsAndDealsView } from './components/EventsAndDealsView';
import { StoriesView } from './components/StoriesView';
import { BusinessOwnerDashboard } from './components/BusinessOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LeadModal } from './components/LeadModal';
import { ClaimBusinessModal } from './components/ClaimBusinessModal';
import { ComparisonModal } from './components/ComparisonModal';
import { ProjectDownloadModal } from './components/ProjectDownloadModal';
import { Footer } from './components/Footer';
import { Megaphone, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, selectedBusinessId, businesses, announcement, setAnnouncement } = useDirectory();

  const currentBusiness = selectedBusinessId
    ? businesses.find((b) => b.id === selectedBusinessId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      {/* Global Broadcast Announcement Banner */}
      {announcement && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white px-4 py-2 text-sm font-medium shadow-md flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 flex-1 px-2">
            <span className="p-1 rounded-full bg-white/20 text-white shrink-0 animate-pulse">
              <Megaphone size={14} />
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {announcement}
            </span>
          </div>
          <button
            onClick={() => setAnnouncement(null)}
            className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Announcement"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <main className="flex-1">
        {currentBusiness ? (
          <BusinessProfileView business={currentBusiness} />
        ) : (
          <>
            {activeTab === 'explore' && (
              <>
                <HeroSection />
                <BusinessDirectory />
              </>
            )}

            {activeTab === 'categories' && <CategoriesView />}

            {activeTab === 'map' && (
              <div className="pt-2">
                <BusinessDirectory />
              </div>
            )}

            {activeTab === 'shop' && <DigitalShopView />}

            {activeTab === 'events' && <EventsAndDealsView />}

            {activeTab === 'stories' && <StoriesView />}

            {activeTab === 'owner_dashboard' && <BusinessOwnerDashboard />}

            {activeTab === 'admin_dashboard' && <AdminDashboard />}
          </>
        )}
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <LeadModal />
      <ClaimBusinessModal />
      <ComparisonModal />
      <ProjectDownloadModal />
    </div>
  );
};

export default function App() {
  return (
    <DirectoryProvider>
      <AppContent />
    </DirectoryProvider>
  );
}
