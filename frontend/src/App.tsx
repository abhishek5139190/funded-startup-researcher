import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { Dashboard } from './pages/Dashboard';
import { useUserProfile } from './hooks/useUserProfile';

function App() {
  const { profile, saveProfile, updateProfile, resetProfile, deleteProfile } = useUserProfile();

  if (!profile) {
    return <OnboardingModal onComplete={saveProfile} />;
  }

  return (
    <Dashboard
      profile={profile}
      onUpdateProfile={updateProfile}
      onResetProfile={resetProfile}
      onDeleteProfile={deleteProfile}
    />
  );
}

export default App;
