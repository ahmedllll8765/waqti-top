import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Upload, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  Plus,
  FileText,
  Image as ImageIcon,
  Award,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Camera,
  Globe,
  MapPin,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';

interface FreelancerVerificationPageProps {
  setActivePage: (page: string) => void;
}

interface VerificationData {
  accountData: {
    username: string;
    accountType: 'freelancer' | 'client';
    termsAccepted: boolean;
    privacyAccepted: boolean;
  };
  profile: {
    jobTitle: string;
    specialization: string;
    introduction: string;
    skills: string[];
    hourlyRate: number;
    availability: 'full_time' | 'part_time' | 'weekends';
    languages: Array<{
      language: string;
      proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }>;
  };
  businessGallery: {
    portfolioItems: Array<{
      id: string;
      title: string;
      description: string;
      thumbnail: File | null;
      images: File[];
      projectUrl?: string;
      skills: string[];
    }>;
    certificates: File[];
    testimonials: Array<{
      clientName: string;
      clientCompany?: string;
      rating: number;
      comment: string;
      projectTitle: string;
    }>;
  };
  admissionTest: {
    completed: boolean;
    score?: number;
  };
}

const FreelancerVerificationPage: React.FC<FreelancerVerificationPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentPortfolioItem, setCurrentPortfolioItem] = useState(0);

  const [verificationData, setVerificationData] = useState<VerificationData>({
    accountData: {
      username: user?.name?.replace(/\s+/g, '_').toLowerCase() || '',
      accountType: 'freelancer',
      termsAccepted: false,
      privacyAccepted: false
    },
    profile: {
      jobTitle: '',
      specialization: '',
      introduction: '',
      skills: [],
      hourlyRate: 50,
      availability: 'full_time',
      languages: [{ language: 'العربية', proficiency: 'native' }]
    },
    businessGallery: {
      portfolioItems: [
        { id: '1', title: '', description: '', thumbnail: null, images: [], skills: [] },
        { id: '2', title: '', description: '', thumbnail: null, images: [], skills: [] },
        { id: '3', title: '', description: '', thumbnail: null, images: [], skills: [] }
      ],
      certificates: [],
      testimonials: []
    },
    admissionTest: {
      completed: false
    }
  });

  const specializations = [
    'Programming, website and application development',
    'Graphic Design and Visual Identity',
    'Digital Marketing and Social Media',
    'Content Writing and Translation',
    'Video and Audio Editing',
    'Business Consulting',
    'Data Analysis and Research',
    'Photography and Videography',
    'UI/UX Design',
    'Mobile App Development'
  ];

  const suggestedSkills = [
    'Python', 'User Interface Design', 'psychology', 'Product label design',
    'Interior design', 'jQuery', 'e-marketing', 'Troubleshooting',
    'Create a landing page', 'Startup Consulting', 'Facebook marketing',
    'video editing', 'Flyer design', 'Proofreading', 'Content rewriting'
  ];

  const steps = [
    { number: 1, title: 'Account data', titleAr: 'بيانات الحساب', icon: User },
    { number: 2, title: 'Profile', titleAr: 'الملف الشخصي', icon: FileText },
    { number: 3, title: 'Business Gallery', titleAr: 'معرض الأعمال', icon: Briefcase },
    { number: 4, title: 'Admission test', titleAr: 'اختبار القبول', icon: Award }
  ];

  const onThumbnailDrop = useCallback((acceptedFiles: File[], portfolioIndex: number) => {
    const file = acceptedFiles[0];
    if (file) {
      setVerificationData(prev => ({
        ...prev,
        businessGallery: {
          ...prev.businessGallery,
          portfolioItems: prev.businessGallery.portfolioItems.map((item, index) =>
            index === portfolioIndex ? { ...item, thumbnail: file } : item
          )
        }
      }));
    }
  }, []);

  const onCertificateDrop = useCallback((acceptedFiles: File[]) => {
    setVerificationData(prev => ({
      ...prev,
      businessGallery: {
        ...prev.businessGallery,
        certificates: [...prev.businessGallery.certificates, ...acceptedFiles]
      }
    }));
  }, []);

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: (files) => onThumbnailDrop(files, currentPortfolioItem),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxFiles: 1
  });

  const { getRootProps: getCertificateRootProps, getInputProps: getCertificateInputProps } = useDropzone({
    onDrop: onCertificateDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  });

  const handleAddSkill = () => {
    if (currentSkill.trim() && !verificationData.profile.skills.includes(currentSkill.trim())) {
      setVerificationData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, currentSkill.trim()]
        }
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setVerificationData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleAddSuggestedSkill = (skill: string) => {
    if (!verificationData.profile.skills.includes(skill)) {
      setVerificationData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, skill]
        }
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return verificationData.accountData.username.length >= 3 &&
               verificationData.accountData.termsAccepted &&
               verificationData.accountData.privacyAccepted;
      case 2:
        return verificationData.profile.jobTitle.length >= 3 &&
               verificationData.profile.specialization !== '' &&
               verificationData.profile.introduction.length >= 50 &&
               verificationData.profile.skills.length >= 3;
      case 3:
        return verificationData.businessGallery.portfolioItems.some(item => 
          item.title && item.description && item.thumbnail
        );
      case 4:
        return verificationData.admissionTest.completed;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      setError('Please complete all required fields before proceeding.');
      return;
    }

    setError('');
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call to submit verification data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send email notification to admin
      console.log('Verification submitted for review:', verificationData);
      console.log('Admin notification sent to: ahmedalhabash13579@gmail.com');
      
      setActivePage('dashboard');
    } catch (err) {
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#2E86AB] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Ahmed Alhabash'}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> اسم المستخدم
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  https://waqti.com/u/
                </span>
                <input
                  type="text"
                  value={verificationData.accountData.username}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    accountData: { ...prev.accountData, username: e.target.value }
                  }))}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                  placeholder="Ahmad_1_1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                يجب أن يكون فريداً ويحتوي على أحرف وأرقام وشرطات سفلية (_) فقط. لا يمكن تغييره لاحقاً
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <span className="text-red-500">*</span> نوع الحساب
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  verificationData.accountData.accountType === 'freelancer' 
                    ? 'border-[#2E86AB] bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="freelancer"
                    checked={verificationData.accountData.accountType === 'freelancer'}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      accountData: { ...prev.accountData, accountType: e.target.value as 'freelancer' | 'client' }
                    }))}
                    className="sr-only"
                  />
                  <div className="w-16 h-16 bg-[#2E86AB] rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Independent</h3>
                  <p className="text-sm text-gray-600 text-center">I am looking for projects to implement</p>
                </label>

                <label className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  verificationData.accountData.accountType === 'client' 
                    ? 'border-[#2E86AB] bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="client"
                    checked={verificationData.accountData.accountType === 'client'}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      accountData: { ...prev.accountData, accountType: e.target.value as 'freelancer' | 'client' }
                    }))}
                    className="sr-only"
                  />
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrepreneur</h3>
                  <p className="text-sm text-gray-600 text-center">I am looking for freelancers to implement my projects</p>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={verificationData.accountData.termsAccepted}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    accountData: { ...prev.accountData, termsAccepted: e.target.checked }
                  }))}
                  className="mt-1 rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> I have read and agree to{' '}
                  <button
                    type="button"
                    onClick={() => setActivePage('terms')}
                    className="text-[#2E86AB] hover:underline"
                  >
                    the Terms of Use
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setActivePage('privacy')}
                    className="text-[#2E86AB] hover:underline"
                  >
                    Privacy Statement
                  </button>
                </span>
              </label>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Complete account information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Job title
                </label>
                <input
                  type="text"
                  value={verificationData.profile.jobTitle}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, jobTitle: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                  placeholder="مسوق رقمي"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a job title such as: Architect</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Specialization
                </label>
                <select
                  value={verificationData.profile.specialization}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, specialization: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                >
                  <option value="">Choose your field of work</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Introduction
              </label>
              <textarea
                value={verificationData.profile.introduction}
                onChange={(e) => setVerificationData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, introduction: e.target.value }
                }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                placeholder="مرحباً"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a resume that tells about yourself, your education, experience, and skills
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                  placeholder="Add your skills, experiences and specializations"
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {verificationData.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {verificationData.profile.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#2E86AB] text-white text-sm rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-white hover:text-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Suggested skills</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSuggestedSkill(skill)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        verificationData.profile.skills.includes(skill)
                          ? 'bg-[#2E86AB] text-white border-[#2E86AB]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#2E86AB]'
                      }`}
                      disabled={verificationData.profile.skills.includes(skill)}
                    >
                      {skill} {verificationData.profile.skills.includes(skill) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Add portfolio</h2>
              <p className="text-gray-600 mt-2">Add your portfolio</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Add your top 3 recent works that demonstrate your expertise in your field. The Waqti team will review the works before accepting your application.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Add work that you have done yourself and that is not copied or transferred.</li>
                <li>• Ensure that the work is distinctive and of high quality.</li>
                <li>• Write a clear title and an accurate description that explains the features of the business.</li>
                <li>• Do not send blank or duplicate work.</li>
              </ul>
            </div>

            <div className="space-y-6">
              {verificationData.businessGallery.portfolioItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Work {index + 1} of 3</h3>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {item.title && item.description && item.thumbnail ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Work title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...verificationData.businessGallery.portfolioItems];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          setVerificationData(prev => ({
                            ...prev,
                            businessGallery: { ...prev.businessGallery, portfolioItems: newItems }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                        placeholder="Include a brief title that accurately describes the work"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Thumbnail
                      </label>
                      <div
                        {...getThumbnailRootProps()}
                        onClick={() => setCurrentPortfolioItem(index)}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2E86AB] transition-colors"
                      >
                        <input {...getThumbnailInputProps()} />
                        {item.thumbnail ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(item.thumbnail)}
                              alt="Thumbnail"
                              className="w-24 h-24 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-green-600">✓ Image uploaded</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-600">Drag image here</p>
                            <p className="text-sm text-gray-500">Or click to select manually</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Add an attractive image that expresses the work
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Job description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...verificationData.businessGallery.portfolioItems];
                          newItems[index] = { ...newItems[index], description: e.target.value };
                          setVerificationData(prev => ({
                            ...prev,
                            businessGallery: { ...prev.businessGallery, portfolioItems: newItems }
                          }));
                        }}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86AB] focus:border-[#2E86AB]"
                        placeholder="Add a detailed description that explains the features of the job"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">إكمال معلومات الحساب</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">كيف تتعامل مع التقييمات العملاء؟</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <label className="flex items-start gap-2">
                      <input type="radio" name="reviews" className="mt-1" />
                      <span>عدم الاهتمام بالتقييمات السلبية وتجاهلها</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="reviews" className="mt-1" />
                      <span>الرد بشكل دفاعي على التقييمات السلبية وإظهار الخطأ في تقييم العميل</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="reviews" className="mt-1" />
                      <span>التواصل مع الدعم الفني وطلب حذف التقييمات السلبية</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="reviews" className="mt-1" />
                      <span>الامتنان للتقييمات الإيجابية والاستفادة من التقييمات السلبية لتحسين المشاريع المستقبلية</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">كيف تبني علاقات ناجحة وطويلة الأمد مع عملائك؟</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <label className="flex items-start gap-2">
                      <input type="radio" name="relationships" className="mt-1" />
                      <span>إكمال المشاريع في أسرع وقت ممكن حتى لو كان ذلك يعني المساومة على الجودة</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="relationships" className="mt-1" />
                      <span>التواصل بانتظام والاستماع بفعالية لاحتياجاتهم وتقديم عمل متقن</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="relationships" className="mt-1" />
                      <span>تجاهل ملاحظات العملاء واتخاذ القرارات بناءً على تفضيلاتك وخبرتك فقط</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="relationships" className="mt-1" />
                      <span>الامتنان للتقييمات الإيجابية والاستفادة من التقييمات السلبية لتحسين المشاريع المستقبلية</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">أي من الأمور التالية يجب أن تعطي الأولوية عند التقدم إلى مشروع؟</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <label className="flex items-start gap-2">
                      <input type="radio" name="priority" className="mt-1" />
                      <span>تقديم عرض عام دون تخصيصه</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="priority" className="mt-1" />
                      <span>تقديم معلومات عامة عن مهاراتك حتى لو لم تكن متعلقة بالمشروع</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="priority" className="mt-1" />
                      <span>إظهار فهم واضح مع العميل تم الاتفاق مع بعد بدء التنفيذ</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="radio" name="priority" className="mt-1" />
                      <span>تحديد ميزانية منخفضة لزيادة فرصة الاختيار</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">ما أسباب الحصول على تقييمات سلبية؟</h3>
                  <p className="text-sm text-green-800">
                    اختر أسباب الحصول على تقييمات سلبية
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>التقدم على مستقل لا نتقن العمل عليها</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>الاهتمام بملاحظات العملاء والانفتاح على المراجعات أو التحسينات</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>إبرام اتفاق غير واضح مع العميل تم الاتفاق معه بعد بدء التنفيذ</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>التأثر بتسليم المشروع</span>
                </label>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => {
                  setVerificationData(prev => ({
                    ...prev,
                    admissionTest: { completed: true, score: 85 }
                  }));
                }}
                className="bg-[#2E86AB] text-white px-8 py-3 rounded-lg hover:bg-[#1e5f7a]"
              >
                Complete Test
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-[#2E86AB] text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{step.number}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-600">{step.titleAr}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#2E86AB] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setActivePage('dashboard')}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              {currentStep > 1 ? 'Previous' : 'Cancel'}
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              isLoading={isSubmitting}
              rightIcon={currentStep < 4 ? <ChevronRight className="h-4 w-4" /> : undefined}
              disabled={!validateStep(currentStep)}
            >
              {currentStep < 4 ? 'the next' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerVerificationPage;