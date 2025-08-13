import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Calendar, 
  Download, 
  Plus, 
  Check, 
  X, 
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  CheckCircle
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mpesa' | 'paypal' | 'bank' | 'stripe' | 'apple_pay' | 'google_pay' | 'crypto' | 'alipay' | 'wechat' | 'razorpay' | 'paytm' | 'upi' | 'sepa' | 'ideal' | 'sofort' | 'giropay' | 'eps' | 'p24' | 'bancontact' | 'blik' | 'klarna' | 'afterpay' | 'affirm';
  name: string;
  details: string;
  isDefault: boolean;
  region?: string;
  currency?: string;
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

export default function EnhancedPayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true,
      region: 'Global',
      currency: 'USD'
    },
    {
      id: '2',
      type: 'mpesa',
      name: 'M-Pesa',
      details: '+254 712 345 678',
      isDefault: false,
      region: 'Kenya',
      currency: 'KES'
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      isDefault: false,
      region: 'Global',
      currency: 'USD'
    },
    {
      id: '4',
      type: 'stripe',
      name: 'Stripe',
      details: 'Connected Account',
      isDefault: false,
      region: 'Global',
      currency: 'USD'
    },
    {
      id: '5',
      type: 'apple_pay',
      name: 'Apple Pay',
      details: 'iPhone 12 Pro',
      isDefault: false,
      region: 'Global',
      currency: 'USD'
    },
    {
      id: '6',
      type: 'google_pay',
      name: 'Google Pay',
      details: 'Android Device',
      isDefault: false,
      region: 'Global',
      currency: 'USD'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'card' | 'mpesa' | 'paypal' | 'bank'>('card');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [notifications, setNotifications] = useState([]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as PaymentMethod['type'],
    name: '',
    details: ''
  });
  
  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

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
      case 'stripe':
      case 'apple_pay':
      case 'google_pay':
      case 'alipay':
      case 'wechat':
      case 'razorpay':
      case 'paytm':
      case 'klarna':
      case 'afterpay':
      case 'affirm':
        return <Wallet className="h-5 w-5" />;
      case 'bank':
      case 'sepa':
      case 'ideal':
      case 'sofort':
      case 'giropay':
      case 'eps':
      case 'p24':
      case 'bancontact':
      case 'blik':
        return <DollarSign className="h-5 w-5" />;
      case 'crypto':
        return <DollarSign className="h-5 w-5" />;
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.name && newPaymentMethod.details) {
      // Determine region and currency based on payment type
      let region = 'Global';
      let currency = 'USD';
      
      switch (newPaymentMethod.type) {
        case 'mpesa':
          region = 'Kenya';
          currency = 'KES';
          break;
        case 'alipay':
        case 'wechat':
          region = 'China';
          currency = 'CNY';
          break;
        case 'razorpay':
        case 'paytm':
        case 'upi':
          region = 'India';
          currency = 'INR';
          break;
        case 'sepa':
        case 'ideal':
        case 'sofort':
        case 'giropay':
        case 'eps':
        case 'p24':
        case 'bancontact':
        case 'blik':
          region = 'Europe';
          currency = 'EUR';
          break;
        case 'ideal':
          region = 'Netherlands';
          currency = 'EUR';
          break;
        case 'sofort':
        case 'giropay':
          region = 'Germany';
          currency = 'EUR';
          break;
        case 'eps':
          region = 'Austria';
          currency = 'EUR';
          break;
        case 'p24':
        case 'blik':
          region = 'Poland';
          currency = 'PLN';
          break;
        case 'bancontact':
          region = 'Belgium';
          currency = 'EUR';
          break;
        default:
          region = 'Global';
          currency = 'USD';
      }
      
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: newPaymentMethod.type,
        name: newPaymentMethod.name,
        details: newPaymentMethod.details,
        isDefault: paymentMethods.length === 0,
        region,
        currency
      };
      setPaymentMethods([...paymentMethods, method]);
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `Payment method "${newPaymentMethod.name}" added successfully!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewPaymentMethod({ type: 'card', name: '', details: '' });
      setShowAddPaymentMethod(false);
    } else {
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'error',
        message: 'Please fill in all required fields.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleMakePayment = () => {
    if (paymentAmount && paymentDescription) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        description: paymentDescription,
        amount: parseFloat(paymentAmount),
        status: 'pending',
        method: paymentMethods.find(m => m.type === selectedPaymentType)?.name || 'Unknown',
        reference: `TXN-${Date.now()}`
      };
      setTransactions([transaction, ...transactions]);
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `Payment of $${paymentAmount} initiated successfully!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setPaymentAmount('');
      setPaymentDescription('');
      setShowPaymentModal(false);
      
      // Simulate payment processing
      setTimeout(() => {
        setTransactions(prev => prev.map(t => 
          t.id === transaction.id ? { ...t, status: 'completed' } : t
        ));
        setNotifications(prev => [...prev, {
          id: Date.now() + 1,
          type: 'success',
          message: `Payment completed successfully!`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 3000);
    } else {
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'error',
        message: 'Please fill in all payment details.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg flex items-center justify-between min-w-80 ${
                notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75">{notification.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your payments and billing</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Make Payment
          </button>
          <button
            onClick={() => setShowAddPaymentMethod(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Payment Method
          </button>
        </div>
      </div>

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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentMethods.length}</p>
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
          {paymentMethods.map((method) => (
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{method.details}</p>
              {method.region && method.currency && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{method.region}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{method.currency}</span>
                </div>
              )}
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
              {transactions.map((transaction) => (
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

      {/* Invoices */}
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

      {/* Add Payment Method Modal */}
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
                  <optgroup label="Cards & Digital Wallets">
                    <option value="card">Credit/Debit Card</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="apple_pay">Apple Pay</option>
                    <option value="google_pay">Google Pay</option>
                  </optgroup>
                  
                  <optgroup label="Bank Transfers">
                    <option value="bank">Bank Transfer</option>
                    <option value="sepa">SEPA (Europe)</option>
                    <option value="ideal">iDEAL (Netherlands)</option>
                    <option value="sofort">Sofort (Germany)</option>
                    <option value="giropay">Giropay (Germany)</option>
                    <option value="eps">EPS (Austria)</option>
                    <option value="p24">Przelewy24 (Poland)</option>
                    <option value="bancontact">Bancontact (Belgium)</option>
                    <option value="blik">BLIK (Poland)</option>
                  </optgroup>
                  
                  <optgroup label="Mobile & Regional">
                    <option value="mpesa">M-Pesa (Kenya)</option>
                    <option value="alipay">Alipay (China)</option>
                    <option value="wechat">WeChat Pay (China)</option>
                    <option value="razorpay">Razorpay (India)</option>
                    <option value="paytm">Paytm (India)</option>
                    <option value="upi">UPI (India)</option>
                  </optgroup>
                  
                  <optgroup label="Buy Now, Pay Later">
                    <option value="klarna">Klarna</option>
                    <option value="afterpay">Afterpay</option>
                    <option value="affirm">Affirm</option>
                  </optgroup>
                  
                  <optgroup label="Cryptocurrency">
                    <option value="crypto">Cryptocurrency</option>
                  </optgroup>
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
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddPaymentMethod(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Payment Modal */}
      {showPaymentModal && (
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
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.type}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
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
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMakePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

