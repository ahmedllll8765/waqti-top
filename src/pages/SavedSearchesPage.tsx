import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Bell, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  Star,
  Clock,
  Filter,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: string;
  filters: Record<string, any>;
  category: 'services' | 'projects' | 'freelancers';
  notifications: boolean;
  isPublic: boolean;
  resultCount: number;
  lastRun?: Date;
  createdAt: Date;
}

interface SavedSearchesPageProps {
  setActivePage: (page: string) => void;
}

const SavedSearchesPage: React.FC<SavedSearchesPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [newSearch, setNewSearch] = useState({
    name: '',
    description: '',
    query: '',
    category: 'services' as 'services' | 'projects' | 'freelancers',
    notifications: true,
    isPublic: false
  });

  // Mock saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'مطورين React',
      description: 'البحث عن مطورين متخصصين في React',
      query: 'React developer',
      filters: { category: 'programming', experience: '3+', rating: '4+' },
      category: 'freelancers',
      notifications: true,
      isPublic: false,
      resultCount: 23,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: '2',
      name: 'مشاريع التصميم',
      description: 'مشاريع تصميم الجرافيك والهوية البصرية',
      query: 'graphic design logo',
      filters: { category: 'design', budget: '1000-5000', urgency: 'medium' },
      category: 'projects',
      notifications: true,
      isPublic: true,
      resultCount: 15,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 6),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    },
    {
      id: '3',
      name: 'خدمات الترجمة',
      description: 'خدمات ترجمة عربي-إنجليزي',
      query: 'translation arabic english',
      filters: { category: 'translation', rating: '4.5+', delivery: 'fast' },
      category: 'services',
      notifications: false,
      isPublic: false,
      resultCount: 8,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
    }
  ]);

  const handleCreateSearch = () => {
    const search: SavedSearch = {
      id: Date.now().toString(),
      ...newSearch,
      filters: {},
      resultCount: 0,
      createdAt: new Date()
    };

    setSavedSearches(prev => [search, ...prev]);
    setShowCreateModal(false);
    setNewSearch({
      name: '',
      description: '',
      query: '',
      category: 'services',
      notifications: true,
      isPublic: false
    });
  };

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const handleRunSearch = (search: SavedSearch) => {
    // Simulate running the search
    console.log('Running search:', search);
    
    // Update last run time
    setSavedSearches(prev => prev.map(s => 
      s.id === search.id ? { ...s, lastRun: new Date() } : s
    ));

    // Navigate to appropriate page with search parameters
    switch (search.category) {
      case 'services':
        setActivePage('services');
        break;
      case 'projects':
        setActivePage('projects');
        break;
      case 'freelancers':
        setActivePage('freelancers');
        break;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'services': return '🛠️';
      case 'projects': return '📋';
      case 'freelancers': return '👥';
      default: return '🔍';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'services': return 'الخدمات';
      case 'projects': return 'المشاريع';
      case 'freelancers': return 'المستقلون';
      default: return category;
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">البحوث المحفوظة</h1>
              <p className="text-gray-600">احفظ عمليات البحث المفضلة واحصل على إشعارات عند ظهور نتائج جديدة</p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              إضافة بحث جديد
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">البحوث المحفوظة</p>
                <p className="text-2xl font-bold text-gray-900">{savedSearches.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الإشعارات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.filter(s => s.notifications).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي النتائج</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.reduce((sum, search) => sum + search.resultCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Searches */}
        <div className="space-y-4">
          {savedSearches.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بحوث محفوظة</h3>
              <p className="text-gray-600 mb-6">احفظ عمليات البحث المفضلة لديك للوصول السريع إليها</p>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowCreateModal(true)}
              >
                إضافة بحث جديد
              </Button>
            </div>
          ) : (
            savedSearches.map(search => (
              <div key={search.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(search.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{getCategoryText(search.category)}</span>
                          {search.isPublic && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              عام
                            </span>
                          )}
                          {search.notifications && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              إشعارات
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {search.description && (
                      <p className="text-gray-700 mb-3">{search.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Search className="h-4 w-4" />
                        "{search.query}"
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {search.resultCount} نتيجة
                      </span>
                      {search.lastRun && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          آخر تشغيل: {formatDate(search.lastRun)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(search.filters).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRunSearch(search)}
                      leftIcon={<Search className="h-4 w-4" />}
                    >
                      تشغيل
                    </Button>
                    <button
                      onClick={() => setEditingSearch(search)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Search Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة بحث جديد</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البحث
                  </label>
                  <input
                    type="text"
                    value={newSearch.name}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="أدخل اسم البحث"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={newSearch.description}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="وصف مختصر للبحث"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمات البحث
                  </label>
                  <input
                    type="text"
                    value={newSearch.query}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, query: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="أدخل كلمات البحث"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    value={newSearch.category}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  >
                    <option value="services">الخدمات</option>
                    <option value="projects">المشاريع</option>
                    <option value="freelancers">المستقلون</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSearch.notifications}
                      onChange={(e) => setNewSearch(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
                    />
                    <span className="text-sm text-gray-700">إرسال إشعارات عند وجود نتائج جديدة</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSearch.isPublic}
                      onChange={(e) => setNewSearch(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
                    />
                    <span className="text-sm text-gray-700">جعل البحث عاماً (يمكن للآخرين رؤيته)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  onClick={handleCreateSearch}
                  disabled={!newSearch.name || !newSearch.query}
                >
                  حفظ البحث
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;