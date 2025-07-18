import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Shield, 
  Star,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface WelcomeWalkthroughPageProps {
  setActivePage: (page: string) => void;
  onComplete: () => void;
}

const WelcomeWalkthroughPage: React.FC<WelcomeWalkthroughPageProps> = ({ setActivePage, onComplete }) => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Clock,
      title: 'Welcome to Waqti',
      titleAr: 'مرحباً بك في وقتي',
      description: 'Exchange services using time as currency. Offer your skills and earn time credits to get what you need.',
      descriptionAr: 'تبادل الخدمات باستخدام الوقت كعملة. قدم مهاراتك واكسب ساعات وقت للحصول على ما تحتاجه.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'How Time Exchange Works',
      titleAr: 'كيف يعمل تبادل الوقت',
      description: '1 hour of service = 1 time credit. Everyone\'s time is valued equally, creating a fair exchange system.',
      descriptionAr: 'ساعة واحدة من الخدمة = ساعة وقت واحدة. وقت الجميع له نفس القيمة، مما يخلق نظام تبادل عادل.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Briefcase,
      title: 'Offer Your Services',
      titleAr: 'قدم خدماتك',
      description: 'Create service listings, set your time rate, and start earning time credits from helping others.',
      descriptionAr: 'أنشئ قوائم خدماتك، حدد سعرك بالوقت، وابدأ في كسب ساعات الوقت من مساعدة الآخرين.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageSquare,
      title: 'Connect & Communicate',
      titleAr: 'تواصل وتفاعل',
      description: 'Chat with service providers, negotiate details, and build lasting professional relationships.',
      descriptionAr: 'تحدث مع مقدمي الخدمات، تفاوض على التفاصيل، وابن علاقات مهنية دائمة.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      titleAr: 'آمن ومحمي',
      description: 'Your transactions are protected with our escrow system. Time credits are held safely until service completion.',
      descriptionAr: 'معاملاتك محمية بنظام الضمان لدينا. ساعات الوقت محفوظة بأمان حتى إكمال الخدمة.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Star,
      title: 'Ready to Start?',
      titleAr: 'جاهز للبدء؟',
      description: 'You\'ve received 2 free hours to get started. Begin by exploring services or offering your own!',
      descriptionAr: 'لقد حصلت على ساعتين مجانيتين للبدء. ابدأ بتصفح الخدمات أو تقديم خدماتك الخاصة!',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-[#2E86AB]" />
            <span className="font-semibold text-gray-900">Welcome to Waqti</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#2E86AB] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Step {currentSlide + 1} of {slides.length}</span>
            <span>{Math.round(((currentSlide + 1) / slides.length) * 100)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${slides[currentSlide].color} flex items-center justify-center mx-auto mb-6`}>
                {React.createElement(slides[currentSlide].icon, {
                  className: "h-12 w-12 text-white"
                })}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {slides[currentSlide].title}
              </h2>
              <h3 className="text-lg text-gray-600 mb-4">
                {slides[currentSlide].titleAr}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                {slides[currentSlide].description}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {slides[currentSlide].descriptionAr}
              </p>

              {currentSlide === slides.length - 1 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Your starting balance: 2 hours</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-[#2E86AB]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={currentSlide < slides.length - 1 ? <ChevronRight className="h-4 w-4" /> : undefined}
          >
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>

        {/* Skip Button */}
        <div className="text-center pb-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip walkthrough
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeWalkthroughPage;