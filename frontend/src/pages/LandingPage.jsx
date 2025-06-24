import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen'
import SEOHead from '../utils/SEOHead';
import { useLoading } from '../contexts/LoadingContext';

function LandingPage() {
  const { isAuthLoading } = useAuth();
  const { isVisualLoaded, setIsVisualLoaded } = useLoading();

  return (
    <>
      <SEOHead
        title={`${import.meta.env.VITE_WEBSITE_NAME} - Your Personal Budgeting Companion`}
        description="Manage your finances effortlessly with our AI-powered budgeting assistant. Get personalized insights and recommendations to help you save money and achieve your financial goals."
      />

      {(isAuthLoading || !isVisualLoaded) && (
        <AnimatePresence mode="wait">
          <LoadingScreen key="loader" onComplete={() => setIsVisualLoaded(true)} />
        </AnimatePresence>
      )}

      <div className="bg-primary text-white w-full">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold mb-4">💸 AI Finance Assistant</h1>
          <p className="text-xl mb-6 text-gray-300 text-center max-w-xl">
            Your personal AI-powered budgeting companion
          </p>
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
        </section>

        {/* ChatBot */}
        <section className="flex justify-center py-12">
          {/* <ChatBot /> */}
        </section>

        {/* Scrollable Extra Content */}
        <section className="px-8 py-12 space-y-12">
          <div className="h-80 bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
            <p className="text-gray-300">
              We help you track spending, set goals, and build smarter habits with AI. No spreadsheets. No guesswork.
            </p>
          </div>

          <div className="h-80 bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Smart Insights</h2>
            <p className="text-gray-300">
              Receive personalized reports and alerts tailored to your spending behavior.
            </p>
          </div>

          <div className="h-80 bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Join Thousands</h2>
            <p className="text-gray-300">
              Trusted by a growing community of young professionals and students managing their money smarter.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default LandingPage;