import React, { useState } from 'react';
import { Business } from '../types';
import { generateLocalBusinessSchema } from '../utils/helpers';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileActionBar } from './profile/ProfileActionBar';
import { ProfileOverviewSection } from './profile/ProfileOverviewSection';
import { ProfileServicesSection } from './profile/ProfileServicesSection';
import { ProfileProductsSection } from './profile/ProfileProductsSection';
import { ProfilePortfolioSection } from './profile/ProfilePortfolioSection';
import { ProfileCredentialsSection } from './profile/ProfileCredentialsSection';
import { ProfileTeamSection } from './profile/ProfileTeamSection';
import { ProfileReviewsSection } from './profile/ProfileReviewsSection';
import { ProfileAssistantSection } from './profile/ProfileAssistantSection';
import { ProfileSidebar } from './profile/ProfileSidebar';
import type { ProfileTab } from './profile/profileTabs';

interface BusinessProfileViewProps {
  business: Business;
}

/** Public-facing business profile: thin orchestrator over the profile/ section components. */
export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({ business }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  // JSON-LD Schema
  const schemaJson = JSON.stringify(generateLocalBusinessSchema(business));

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Embedded LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />

      <ProfileHeader business={business} />
      <ProfileActionBar business={business} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column (Content according to tab) */}
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'overview' && (
              <ProfileOverviewSection business={business} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'services' && <ProfileServicesSection business={business} />}
            {activeTab === 'products' && <ProfileProductsSection business={business} />}
            {activeTab === 'portfolio' && <ProfilePortfolioSection business={business} />}
            {activeTab === 'credentials' && <ProfileCredentialsSection business={business} />}
            {activeTab === 'team' && <ProfileTeamSection business={business} />}
            {activeTab === 'reviews' && <ProfileReviewsSection business={business} />}
            {activeTab === 'assistant' && <ProfileAssistantSection business={business} />}
          </div>

          {/* Right Column: Contact, Location Map & Hours */}
          <ProfileSidebar business={business} />
        </div>
      </div>
    </div>
  );
};
