import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface EmailVerificationPageProps {
  setActivePage: (page: string) => void;
  email?: string;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ setActivePage, email }) => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Simulate API call - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      // Simulate checking verification status - will be replaced with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo purposes, randomly set as verified
      if (Math.random() > 0.5) {
        setIsVerified(true);
        setTimeout(() => {
          setActivePage('dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center">
            {isVerified ? (
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            ) : (
              <Mail className="mx-auto h-16 w-16 text-[#2E86AB] mb-4" />
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isVerified ? 'Email Verified!' : 'Check Your Email'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isVerified 
                ? 'Your email has been successfully verified. Redirecting to dashboard...'
                : `We've sent a verification link to ${email || user?.email || 'your email address'}`
              }
            </p>

            {!isVerified && (
              <>
                <div className="space-y-4">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={checkVerificationStatus}
                  >
                    I've Verified My Email
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleResendEmail}
                    isLoading={isResending}
                    disabled={resendCooldown > 0}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : 'Resend Email'
                    }
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActivePage('login')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Didn't receive the email?</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes for the email to arrive</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;