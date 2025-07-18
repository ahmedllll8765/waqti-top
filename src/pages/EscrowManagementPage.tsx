import React, { useState } from 'react';
import { 
  Shield, 
  Clock, 
  DollarSign, 
  User, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface EscrowItem {
  id: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  currency: 'hours' | 'AED';
  status: 'held' | 'released' | 'disputed' | 'refunded';
  createdAt: Date;
  dueDate: Date;
  autoReleaseDate: Date;
  description: string;
}

interface EscrowManagementPageProps {
  setActivePage: (page: string) => void;
}

const EscrowManagementPage: React.FC<EscrowManagementPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'release' | 'refund' | null>(null);

  // Mock escrow data
  const [escrowItems] = useState<EscrowItem[]>([
    {
      id: 'esc1',
      projectId: 'proj1',
      projectTitle: 'تطوير موقع التجارة الإلكترونية',
      clientId: 'client1',
      clientName: 'شركة التقنية المتقدمة',
      freelancerId: 'freelancer1',
      freelancerName: 'أحمد حسن',
      amount: 50,
      currency: 'hours',
      status: 'held',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      autoReleaseDate: new Date('2024-02-22'),
      description: 'تطوير موقع تجارة إلكترونية متكامل مع نظام إدارة المخزون'
    },
    {
      id: 'esc2',
      projectId: 'proj2',
      projectTitle: 'تصميم هوية بصرية',
      clientId: 'client2',
      clientName: 'أحمد محمد',
      freelancerId: 'freelancer2',
      freelancerName: 'سارة علي',
      amount: 2500,
      currency: 'AED',
      status: 'held',
      createdAt: new Date('2024-01-20'),
      dueDate: new Date('2024-02-10'),
      autoReleaseDate: new Date('2024-02-17'),
      description: 'تصميم هوية بصرية متكاملة للشركة الناشئة'
    },
    {
      id: 'esc3',
      projectId: 'proj3',
      projectTitle: 'ترجمة كتاب تقني',
      clientId: 'client3',
      clientName: 'دار النشر العربية',
      freelancerId: 'freelancer3',
      freelancerName: 'ليلى محمد',
      amount: 30,
      currency: 'hours',
      status: 'disputed',
      createdAt: new Date('2024-01-10'),
      dueDate: new Date('2024-02-01'),
      autoReleaseDate: new Date('2024-02-08'),
      description: 'ترجمة كتاب تقني من الإنجليزية إلى العربية'
    }
  ]);

  const filteredItems = escrowItems.filter(item => {
    const matchesSearch = item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.freelancerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held': return 'text-yellow-600 bg-yellow-100';
      case 'released': return 'text-green-600 bg-green-100';
      case 'disputed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'held': return 'محجوز';
      case 'released': return 'مُطلق';
      case 'disputed': return 'متنازع عليه';
      case 'refunded': return 'مُسترد';
      default: return status;
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

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'hours') {
      return `${amount} ساعة`;
    }
    return `${amount} ${currency}`;
  };

  const getDaysUntilAutoRelease = (autoReleaseDate: Date) => {
    const now = new Date();
    const diffTime = autoReleaseDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAction = async (escrowId: string, action: 'release' | 'refund') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} escrow ${escrowId}`);
      setShowModal(false);
      setSelectedEscrow(null);
      setActionType(null);
      
      // In real implementation, refresh the data
    } catch (error) {
      console.error(`Failed to ${action} escrow:`, error);
    }
  };

  const openActionModal = (escrow: EscrowItem, action: 'release' | 'refund') => {
    setSelectedEscrow(escrow);
    setActionType(action);
    setShowModal(true);
  };

  if (!user || user.email !== 'admin@waqti.com') {
    setActivePage('dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الضمان</h1>
              <p className="text-gray-600">إدارة الأموال والساعات المحجوزة في النظام</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                تحديث
              </Button>
              <Button
                variant="primary"
                leftIcon={<Download className="h-4 w-4" />}
              >
                تصدير
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المحجوز</p>
                <p className="text-2xl font-bold text-gray-900">
                  {escrowItems.filter(item => item.status === 'held').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ساعات محجوزة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {escrowItems
                    .filter(item => item.status === 'held' && item.currency === 'hours')
                    .reduce((sum, item) => sum + item.amount, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">أموال محجوزة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {escrowItems
                    .filter(item => item.status === 'held' && item.currency === 'AED')
                    .reduce((sum, item) => sum + item.amount, 0).toLocaleString()} AED
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نزاعات نشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {escrowItems.filter(item => item.status === 'disputed').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في المشاريع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="held">محجوز</option>
              <option value="released">مُطلق</option>
              <option value="disputed">متنازع عليه</option>
              <option value="refunded">مُسترد</option>
            </select>
          </div>
        </div>

        {/* Escrow Items */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المشروع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل / المستقل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإطلاق التلقائي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => {
                  const daysUntilRelease = getDaysUntilAutoRelease(item.autoReleaseDate);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.projectTitle}</div>
                          <div className="text-sm text-gray-500">{formatDate(item.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">العميل:</span> {item.clientName}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">المستقل:</span> {item.freelancerName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(item.amount, item.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'held' && (
                          <div className="text-sm">
                            {daysUntilRelease > 0 ? (
                              <span className="text-gray-600">{daysUntilRelease} أيام</span>
                            ) : (
                              <span className="text-red-600 font-medium">متأخر</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedEscrow(item);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {item.status === 'held' && (
                            <>
                              <button
                                onClick={() => openActionModal(item, 'release')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openActionModal(item, 'refund')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Modal */}
        {showModal && selectedEscrow && actionType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {actionType === 'release' ? 'إطلاق الضمان' : 'استرداد الضمان'}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-700">المشروع:</span>
                  <p className="text-gray-900">{selectedEscrow.projectTitle}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">المبلغ:</span>
                  <p className="text-gray-900">{formatAmount(selectedEscrow.amount, selectedEscrow.currency)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {actionType === 'release' ? 'سيتم الإطلاق إلى:' : 'سيتم الاسترداد إلى:'}
                  </span>
                  <p className="text-gray-900">
                    {actionType === 'release' ? selectedEscrow.freelancerName : selectedEscrow.clientName}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleAction(selectedEscrow.id, actionType)}
                  className={actionType === 'release' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {actionType === 'release' ? 'إطلاق الضمان' : 'استرداد الضمان'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEscrow(null);
                    setActionType(null);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedEscrow && !actionType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">تفاصيل الضمان</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEscrow(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">المشروع:</span>
                    <p className="text-gray-900">{selectedEscrow.projectTitle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">المبلغ:</span>
                    <p className="text-gray-900">{formatAmount(selectedEscrow.amount, selectedEscrow.currency)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">العميل:</span>
                    <p className="text-gray-900">{selectedEscrow.clientName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">المستقل:</span>
                    <p className="text-gray-900">{selectedEscrow.freelancerName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">تاريخ الإنشاء:</span>
                    <p className="text-gray-900">{formatDate(selectedEscrow.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">الإطلاق التلقائي:</span>
                    <p className="text-gray-900">{formatDate(selectedEscrow.autoReleaseDate)}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">الوصف:</span>
                  <p className="text-gray-900 mt-1">{selectedEscrow.description}</p>
                </div>

                {selectedEscrow.status === 'held' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setActionType('release');
                      }}
                      className="bg-green-600 hover:bg-green-700"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      إطلاق الضمان
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setActionType('refund');
                      }}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      leftIcon={<XCircle className="h-4 w-4" />}
                    >
                      استرداد الضمان
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowManagementPage;