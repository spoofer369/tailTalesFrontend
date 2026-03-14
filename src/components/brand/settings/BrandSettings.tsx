import { useState } from "react";
import {
  User,
  Users,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import BrandProfileTab from "./BrandProfileTab";
import BrandTeamTab from "./BrandTeamTab";

const tabs = [
  { id: "profile", label: "Profile & Locations", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "kyc", label: "KYC", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function BrandSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Brand Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your brand profile and settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && <BrandProfileTab />}
        {activeTab === "team" && <BrandTeamTab />}
        {activeTab === "feedback" && <PlaceholderTab title="Brand Feedback" />}
        {activeTab === "kyc" && <PlaceholderTab title="KYC Verification" />}
      </div>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <ShieldCheck className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        This section is coming soon. Stay tuned for updates.
      </p>
    </div>
  );
}
