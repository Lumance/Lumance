import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QUESTIONS } from '../../utils'

const OnboardingPage = () => {
    const navigate = useNavigate(); // Create user avatar and website icon on top and check if user has already onbaorded or not, if user is not logged in take him to login or sign up page
    const [searchParams, setSearchParams] = useSearchParams();
    const stepFromUrl = parseInt(searchParams.get('step')) || 1;

    const [answers, setAnswers] = useState({});
    const [currentStep, setCurrentStep] = useState(stepFromUrl);

    useEffect(() => {
        setCurrentStep(stepFromUrl);
    }, [stepFromUrl]);

    const handleAnswer = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [currentStep]: answer
        }));
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length) {
            setSearchParams({ step: currentStep + 1 });
        } else {
            console.log('Form submitted:', answers);
            navigate('/dashboard');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setSearchParams({ step: currentStep - 1 });
        }
    };

    const currentQuestion = QUESTIONS.find(q => q.id === currentStep);

    return (
        <div className="min-h-screen min-w-full bg-[#0E0C15] text-white">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="h-2 bg-gray-700 rounded-full">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                        Step {currentStep} of {QUESTIONS.length}
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>

                    {currentQuestion.options ? (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${answers[currentStep] === option.value
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <input
                            type={currentQuestion.type}
                            placeholder={currentQuestion.placeholder}
                            value={answers[currentStep] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentStep]}
                        className={`px-6 py-2 rounded-lg ${!answers[currentStep]
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {currentStep < QUESTIONS.length ? 'Next' : 'Finish'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OnboardingPage
