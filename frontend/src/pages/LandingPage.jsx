import { Link } from 'react-router-dom';
import ChatBot from '../components/ChatBot';

function LandingPage() {
  return (
    <div className="min-h-screen min-w-full bg-[#0E0C15] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">💸 AI Finance Assistant</h1>
      <p className="text-xl mb-8 text-gray-300">Your personal AI-powered budgeting companion</p>
      <Link 
        to="/register" 
        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Get Started
      </Link>
      <ChatBot />
    </div>
  );
}

export default LandingPage;