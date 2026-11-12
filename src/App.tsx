import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashAnimation } from './components/SplashAnimation';
import { Onboarding } from './components/Onboarding';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { PropertyDetailScreen } from './components/PropertyDetailScreen';
import { AddPropertyWizard } from './components/AddPropertyWizard';
import { ChatsScreen } from './components/ChatsScreen';
import { ChatConversationScreen } from './components/ChatConversationScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavbar } from './components/BottomNavbar';

const AppContent: React.FC = () => {
  const { currentView, user } = useApp();

  // Route guard: signed-out users can open splash, onboarding, auth, terms and privacy policy,
  // or browse home/search/detail in guest mode with auth prompt on action.
  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashAnimation />;
      case 'onboarding':
        return <Onboarding />;
      case 'auth':
        return <AuthScreen />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'detail':
        return <PropertyDetailScreen />;
      case 'add':
        return user ? <AddPropertyWizard /> : <AuthScreen />;
      case 'chats':
        return <ChatsScreen />;
      case 'conversation':
        return user ? <ChatConversationScreen /> : <AuthScreen />;
      case 'profile':
      case 'profile_listings':
      case 'profile_saved':
        return <ProfileScreen />;
      case 'settings':
      case 'privacy_security':
      case 'terms':
      case 'privacy_policy':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AndroidFrame>
      <div className="flex-1 w-full h-full flex flex-col overflow-hidden relative">
        <main className="flex-1 w-full h-full overflow-hidden flex flex-col relative">
          {renderCurrentView()}
        </main>
        <BottomNavbar />
      </div>
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
