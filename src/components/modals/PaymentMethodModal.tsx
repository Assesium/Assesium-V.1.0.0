import React, { useState } from 'react';
import { X, CreditCard, Lock, Smartphone, Wallet, Banknote } from 'lucide-react';
import Button from '../Button';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethod: {
    type: string;
    details: string;
    name: string;
    saveForFuture: boolean;
  }) => void;
}

interface FormData {
  type: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  mpesaNumber: string;
  paypalEmail: string;
  bankName: string;
  accountNumber: string;
  email: string;
  phoneNumber: string;
  walletAddress: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  saveForFuture: boolean;
}

export default function PaymentMethodModal({ isOpen, onClose, onSave }: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<FormData>({
    type: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    mpesaNumber: '',
    paypalEmail: '',
    bankName: '',
    accountNumber: '',
    email: '',
    phoneNumber: '',
    walletAddress: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    saveForFuture: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let details = '';
    let name = '';

    switch (formData.type) {
      case 'card':
        details = `**** **** **** ${formData.cardNumber.slice(-4)}`;
        name = `Card ending in ${formData.cardNumber.slice(-4)}`;
        break;
      case 'mpesa':
        details = formData.mpesaNumber;
        name = `M-Pesa ${formData.mpesaNumber}`;
        break;
      case 'paypal':
        details = formData.paypalEmail;
        name = `PayPal ${formData.paypalEmail}`;
        break;
      case 'bank':
        details = `${formData.bankName} Account ${formData.accountNumber.slice(-4)}`;
        name = `Bank Account ending in ${formData.accountNumber.slice(-4)}`;
        break;
      case 'stripe':
        details = formData.email;
        name = `Stripe ${formData.email}`;
        break;
      case 'apple_pay':
        details = formData.email;
        name = `Apple Pay ${formData.email}`;
        break;
      case 'google_pay':
        details = formData.email;
        name = `Google Pay ${formData.email}`;
        break;
      case 'alipay':
        details = formData.email;
        name = `Alipay ${formData.email}`;
        break;
      case 'wechat_pay':
        details = formData.phoneNumber;
        name = `WeChat Pay ${formData.phoneNumber}`;
        break;
      case 'razorpay':
        details = formData.email;
        name = `Razorpay ${formData.email}`;
        break;
      case 'paytm':
        details = formData.phoneNumber;
        name = `Paytm ${formData.phoneNumber}`;
        break;
      case 'upi':
        details = formData.email;
        name = `UPI ${formData.email}`;
        break;
      case 'ideal':
        details = formData.email;
        name = `iDEAL ${formData.email}`;
        break;
      case 'sofort':
        details = formData.email;
        name = `SOFORT ${formData.email}`;
        break;
      case 'giropay':
        details = formData.email;
        name = `Giropay ${formData.email}`;
        break;
      case 'bancontact':
        details = formData.email;
        name = `Bancontact ${formData.email}`;
        break;
      case 'eps':
        details = formData.email;
        name = `EPS ${formData.email}`;
        break;
      case 'p24':
        details = formData.email;
        name = `Przelewy24 ${formData.email}`;
        break;
      case 'sepa':
        details = `${formData.bankName} ${formData.accountNumber.slice(-4)}`;
        name = `SEPA ${formData.bankName}`;
        break;
      case 'bacs':
        details = `${formData.bankName} ${formData.accountNumber.slice(-4)}`;
        name = `BACS ${formData.bankName}`;
        break;
      case 'afterpay':
        details = formData.email;
        name = `Afterpay ${formData.email}`;
        break;
      case 'klarna':
        details = formData.email;
        name = `Klarna ${formData.email}`;
        break;
      case 'affirm':
        details = formData.email;
        name = `Affirm ${formData.email}`;
        break;
      case 'cryptocurrency':
        details = formData.walletAddress;
        name = `Crypto Wallet ${formData.walletAddress.slice(0, 6)}...${formData.walletAddress.slice(-4)}`;
        break;
      default:
        details = formData.email || formData.phoneNumber || 'Payment Method';
        name = `${formData.type} Payment Method`;
        break;
    }

    onSave({
      type: formData.type,
      details,
      name,
      saveForFuture: formData.saveForFuture,
    });
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Payment Method</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Type Selection - Prominently displayed at the top */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Payment Method</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select your preferred payment method from the options below</p>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="card">Credit/Debit Card (Visa, Mastercard, Amex)</option>
                <option value="mpesa">M-Pesa (Kenya)</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="apple_pay">Apple Pay</option>
                <option value="google_pay">Google Pay</option>
                <option value="alipay">Alipay (China)</option>
                <option value="wechat_pay">WeChat Pay (China)</option>
                <option value="razorpay">Razorpay (India)</option>
                <option value="paytm">Paytm (India)</option>
                <option value="upi">UPI (India)</option>
                <option value="ideal">iDEAL (Netherlands)</option>
                <option value="sofort">SOFORT (Europe)</option>
                <option value="giropay">Giropay (Germany)</option>
                <option value="bancontact">Bancontact (Belgium)</option>
                <option value="eps">EPS (Austria)</option>
                <option value="p24">Przelewy24 (Poland)</option>
                <option value="sepa">SEPA Direct Debit (Europe)</option>
                <option value="bacs">BACS Direct Debit (UK)</option>
                <option value="bank">Bank Transfer</option>
                <option value="afterpay">Afterpay</option>
                <option value="klarna">Klarna</option>
                <option value="affirm">Affirm</option>
                <option value="cryptocurrency">Cryptocurrency</option>
              </select>
            </div>

            {/* Conditional Input Fields based on Payment Type */}
            {formData.type === 'card' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Card Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="cardholderName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'mpesa' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">M-Pesa Information</h3>
                <div>
                  <label
                    htmlFor="mpesaNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    M-Pesa Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="mpesaNumber"
                      name="mpesaNumber"
                      value={formData.mpesaNumber}
                      onChange={handleInputChange}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <Smartphone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'paypal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">PayPal Information</h3>
                <div>
                  <label
                    htmlFor="paypalEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    PayPal Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="paypalEmail"
                      name="paypalEmail"
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                      placeholder="example@example.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <Wallet className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'bank' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Transfer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., Bank of America"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Account Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="1234567890"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <Banknote className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Digital Wallet Payment Methods */}
            {(['stripe', 'apple_pay', 'google_pay', 'alipay', 'razorpay', 'upi', 'ideal', 'sofort', 'giropay', 'bancontact', 'eps', 'p24', 'afterpay', 'klarna', 'affirm'].includes(formData.type)) && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1).replace('_', ' ')} Information
                </h3>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@example.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <Wallet className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Phone-based Payment Methods */}
            {(['wechat_pay', 'paytm'].includes(formData.type)) && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1).replace('_', ' ')} Information
                </h3>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 XXX XXX XXXX"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <Smartphone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* SEPA and BACS Direct Debit */}
            {(['sepa', 'bacs'].includes(formData.type)) && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formData.type.toUpperCase()} Direct Debit Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., Deutsche Bank"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {formData.type === 'sepa' ? 'IBAN' : 'Account Number'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder={formData.type === 'sepa' ? 'DE89 3704 0044 0532 0130 00' : '12345678'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <Banknote className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cryptocurrency */}
            {formData.type === 'cryptocurrency' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cryptocurrency Information</h3>
                <div>
                  <label
                    htmlFor="walletAddress"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Wallet Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <Wallet className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="billingAddress.street"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="billingAddress.street"
                    name="billingAddress.street"
                    value={formData.billingAddress.street}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingAddress.city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="billingAddress.city"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingAddress.state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="billingAddress.state"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingAddress.country"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="billingAddress.country"
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingAddress.postalCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="billingAddress.postalCode"
                    name="billingAddress.postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Save for Future */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveForFuture"
                name="saveForFuture"
                checked={formData.saveForFuture}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="saveForFuture"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Save this payment method for future payments
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Add Payment Method
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 