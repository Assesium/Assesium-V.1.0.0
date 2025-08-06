import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { DynamicChart } from '../components/charts/DynamicChart';
import {
  CreditCard,
  Calendar,
  Download,
  Plus,
  ChevronRight,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Eye,
  Smartphone,
  DollarSign,
  Clock,
  AlertCircle,
  Receipt,
  Wallet
} from 'lucide-react';
import Button from '../components/Button';
import { usePaymentStore, type PaymentMethod as OriginalPaymentMethod } from '../stores/usePaymentStore';
import { useModalStore } from '../stores/useModalStore';
import PaymentMethodModal from '../components/modals/PaymentMethodModal';
import PaymentDetailsModal from '../components/modals/PaymentDetailsModal';
import TransactionDetailsModal from '../components/modals/TransactionDetailsModal';
import SubscriptionPlanModal from '../components/modals/SubscriptionPlanModal';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  color: string;
  popular?: boolean;
}

// New interfaces from EnhancedPayments.tsx
interface PaymentMethod {
  id: string;
  type: 'card' | 'mpesa' | 'paypal' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  reference: string;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: 'Basic',
    price: 499,
    period: 'year',
    features: [
      'Up to 500 students',
      'Basic AI grading',
      'Standard reports',
      'Email support',
      '5 admin users'
    ],
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 2,
    name: 'Professional',
    price: 999,
    period: 'year',
    features: [
      'Up to 2,000 students',
      'Advanced AI grading',
      'Custom reports',
      'Priority support',
      '15 admin users',
      'Data export options'
    ],
    color: 'from-purple-500 to-indigo-600',
    popular: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 1999,
    period: 'year',
    features: [
      'Unlimited students',
      'Premium AI grading',
      'Advanced analytics',
      '24/7 dedicated support',
      'Unlimited admin users',
      'API access',
      'Custom integrations'
    ],
    color: 'from-pink-500 to-rose-600'
  }
];

const transactionsData = [
  { id: 1, date: '2023-06-15', amount: 1299.99, status: 'Completed', description: 'Annual Subscription', institution: 'Cambridge High School' },
  { id: 2, date: '2023-05-15', amount: 499.99, status: 'Completed', description: 'Additional User Licenses', institution: 'Oxford Academy' },
  { id: 3, date: '2023-04-10', amount: 799.99, status: 'Completed', description: 'Premium Features Upgrade', institution: 'Cambridge High School' },
  { id: 4, date: '2023-03-22', amount: 149.99, status: 'Refunded', description: 'Add-on Module', institution: 'St. Patrick\'s College' },
  { id: 5, date: '2023-02-15', amount: 1299.99, status: 'Completed', description: 'Annual Subscription', institution: 'Cambridge High School' },
];

export default function Payments() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState(2); // Professional plan selected by default
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { openModal } = useModalStore();
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [showSubscriptionPlanModal, setShowSubscriptionPlanModal] = useState(false);
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<OriginalPaymentMethod | null>(null);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactionsData[0] | null>(null);

  const { paymentMethods: originalPaymentMethods, addPaymentMethod: addOriginalPaymentMethod, deletePaymentMethod: deleteOriginalPaymentMethod } = usePaymentStore();

  // New states for enhanced payments
  const [enhancedPaymentMethods, setEnhancedPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true
    },
    {
      id: '2',
      type: 'mpesa',
      name: 'M-Pesa',
      details: '+254 712 345 678',
      isDefault: false
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      isDefault: false
    }
  ]);

  const [enhancedTransactions, setEnhancedTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-08-06',
      description: 'Annual Subscription',
      amount: 1299.99,
      status: 'completed',
      method: 'Visa *4242',
      reference: 'TXN-2025-001'
    },
    {
      id: '2',
      date: '2025-07-15',
      description: 'Additional User Licenses',
      amount: 499.99,
      status: 'completed',
      method: 'M-Pesa',
      reference: 'TXN-2025-002'
    },
    {
      id: '3',
      date: '2025-06-10',
      description: 'Premium Features Upgrade',
      amount: 799.99,
      status: 'completed',
      method: 'PayPal',
      reference: 'TXN-2025-003'
    },
    {
      id: '4',
      date: '2025-08-05',
      description: 'Monthly Processing Fee',
      amount: 149.99,
      status: 'pending',
      method: 'Visa *4242',
      reference: 'TXN-2025-004'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2025-001',
      date: '2025-08-01',
      dueDate: '2025-08-15',
      amount: 1299.99,
      status: 'paid',
      description: 'Annual Subscription Renewal'
    },
    {
      id: 'INV-2025-002',
      date: '2025-08-05',
      dueDate: '2025-08-20',
      amount: 149.99,
      status: 'pending',
      description: 'Monthly Processing Fee'
    }
  ]);

  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'card' | 'mpesa' | 'paypal' | 'bank'>('card');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as PaymentMethod['type'],
    name: '',
    details: ''
  });

  const filteredTransactions = transactionsData.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Spending',
      data: [1299, 299, 149, 799, 499, 1299],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: '#4f46e5',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };

  const handleSavePaymentMethod = (paymentMethod: Omit<OriginalPaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    addOriginalPaymentMethod(paymentMethod);
    setShowPaymentMethodModal(false);
  };

  const handleViewPaymentDetails = (id: string) => {
    const paymentMethod = originalPaymentMethods.find((m) => m.id === id);
    if (paymentMethod) {
      setSelectedPaymentMethod(paymentMethod);
      setShowPaymentDetailsModal(true);
    } else {
      console.error('Payment method not found:', id);
    }
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      deleteOriginalPaymentMethod(id);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedSubscriptionPlan(plan);
    setShowSubscriptionPlanModal(true);
  };
  
  const handlePlanButtonClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id);
    handlePlanSelect(plan);
  };

  const handlePlanChange = (plan: SubscriptionPlan) => {
    console.log('Changing plan to:', plan.name);
    setSelectedPlan(plan.id);
    setShowSubscriptionPlanModal(false);
    setSelectedSubscriptionPlan(null);
  };

  // New functions for enhanced payments
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
      case 'overdue':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'mpesa':
        return <Smartphone className="h-5 w-5" />;
      case 'paypal':
        return <Wallet className="h-5 w-5" />;
      case 'bank':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleAddEnhancedPaymentMethod = () => {
    if (newPaymentMethod.name && newPaymentMethod.details) {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: newPaymentMethod.type,
        name: newPaymentMethod.name,
        details: newPaymentMethod.details,
        isDefault: enhancedPaymentMethods.length === 0
      };
      setEnhancedPaymentMethods([...enhancedPaymentMethods, method]);
      setNewPaymentMethod({ type: 'card', name: '', details: '' });
      setShowAddPaymentMethod(false);
    }
  };

  const handleMakeEnhancedPayment = () => {
    if (paymentAmount && paymentDescription) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        description: paymentDescription,
        amount: parseFloat(paymentAmount),
        status: 'pending',
        method: enhancedPaymentMethods.find(m => m.type === selectedPaymentType)?.name || 'Unknown',
        reference: `TXN-${Date.now()}`
      };
      setEnhancedTransactions([transaction, ...enhancedTransactions]);
      setPaymentAmount('');
      setPaymentDescription('');
      setShowMakePaymentModal(false);
      
      // Simulate payment processing
      setTimeout(() => {
        setEnhancedTransactions(prev => prev.map(t => 
          t.id === transaction.id ? { ...t, status: 'completed' } : t
        ));
      }, 3000);
    }
  };

  const totalSpent = enhancedTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = enhancedTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Billing</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4" />}
            onClick={() => openModal('export', { options: { type: 'payments' } })}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowPaymentMethodModal(true)}
          >
            Add Payment Method
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowMakePaymentModal(true)}
          >
            Make Payment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 mb-6 transition-colors duration-300">
        <div className="flex flex-wrap gap-1">
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'overview' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'transactions' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'payment-methods' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('payment-methods')}
          >
            Payment Methods
          </button>
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'subscription' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('subscription')}
          >
            Subscription Plans
          </button>
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'enhanced-payments' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('enhanced-payments')}
          >
            Enhanced Payments
          </button>
          <button
            className={`px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'invoices' ? 'bg-indigo-600 dark:bg-indigo-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">Professional</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing Date</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">June 15, 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Methods</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{originalPaymentMethods.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Spending</h3>
              <select className="border dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-80">
              <DynamicChart type="line" data={spendingData} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
              <button 
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm flex items-center gap-1"
                onClick={() => setActiveTab('transactions')}
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactionsData.slice(0, 3).map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Payments Tab */}
      {activeTab === 'enhanced-payments' && (
        <div className="space-y-6">
          {/* Payment Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${pendingAmount.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Methods</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{enhancedPaymentMethods.length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Billing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Aug 15</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancedPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    method.isDefault 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(method.type)}
                      <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{transaction.description}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{transaction.method}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          title="Download Receipt"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoices</h3>
          
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{invoice.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{invoice.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="font-bold text-gray-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                  <button
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Download Invoice"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showPaymentMethodModal && (
        <PaymentMethodModal
          onSave={handleSavePaymentMethod}
          onClose={() => setShowPaymentMethodModal(false)}
        />
      )}

      {showPaymentDetailsModal && selectedPaymentMethod && (
        <PaymentDetailsModal
          paymentMethod={selectedPaymentMethod}
          onClose={() => setShowPaymentDetailsModal(false)}
        />
      )}

      {showTransactionDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setShowTransactionDetailsModal(false)}
        />
      )}

      {showSubscriptionPlanModal && selectedSubscriptionPlan && (
        <SubscriptionPlanModal
          plan={selectedSubscriptionPlan}
          onConfirm={handlePlanChange}
          onClose={() => setShowSubscriptionPlanModal(false)}
        />
      )}

      {/* Enhanced Payment Modals */}
      {showAddPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Payment Method</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Type
                </label>
                <select
                  value={newPaymentMethod.type}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value as PaymentMethod['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Visa ending in 1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Details
                </label>
                <input
                  type="text"
                  value={newPaymentMethod.details}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., **** **** **** 1234"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEnhancedPaymentMethod}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMakePaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Make Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value as PaymentMethod['type'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {enhancedPaymentMethods.map((method) => (
                    <option key={method.id} value={method.type}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Payment description"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowMakePaymentModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeEnhancedPayment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

