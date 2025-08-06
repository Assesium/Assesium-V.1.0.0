import React, { useState } from 'react';
import { X, Check, AlertTriangle, CreditCard, Shield } from 'lucide-react';
import Button from '../Button';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  color: string;
  popular?: boolean;
}

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: SubscriptionPlan) => void;
  currentPlan?: SubscriptionPlan;
}

const availablePlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    features: [
      'Up to 100 students',
      'Basic analytics',
      'Email support',
      '5GB storage',
      'Standard reports'
    ],
    color: 'blue'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29.99,
    period: 'month',
    features: [
      'Up to 500 students',
      'Advanced analytics',
      'Priority email support',
      '25GB storage',
      'Custom reports',
      'API access'
    ],
    color: 'indigo',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    period: 'month',
    features: [
      'Unlimited students',
      'Premium analytics',
      '24/7 phone support',
      '100GB storage',
      'Custom reports',
      'API access',
      'Dedicated account manager',
      'White-label options'
    ],
    color: 'purple'
  }
];

export default function SubscriptionPlanModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan
}: SubscriptionPlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(currentPlan || null);
  // Track hover state for enhanced interactivity
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    
    // Adjust price for yearly billing (20% discount)
    const finalPlan = {
      ...selectedPlan,
      price: billingCycle === 'yearly' ? selectedPlan.price * 12 * 0.8 : selectedPlan.price,
      period: billingCycle === 'yearly' ? 'year' : 'month'
    };
    
    // Simulate API call
    setTimeout(() => {
      onConfirm(finalPlan);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const isUpgrade = selectedPlan && currentPlan ? selectedPlan.price > currentPlan.price : false;
  const priceDifference = selectedPlan && currentPlan 
    ? Math.abs(selectedPlan.price - currentPlan.price)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Select Subscription Plan
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
              <button
                onClick={() => handleBillingCycleChange('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  billingCycle === 'monthly' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => handleBillingCycleChange('yearly')}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                  billingCycle === 'yearly' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Yearly Billing
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Comparison */}
          {currentPlan && selectedPlan && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="text-lg font-semibold">{currentPlan.name}</p>
                  <p className="text-2xl font-bold">${currentPlan.price}/{currentPlan.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">New Plan</p>
                  <p className="text-lg font-semibold">{selectedPlan.name}</p>
                  <p className="text-2xl font-bold">${selectedPlan.price}/{selectedPlan.period}</p>
                </div>
              </div>
            </div>
          )}

          {/* Price Difference Warning */}
          {selectedPlan && currentPlan && (
            <div className={`p-4 rounded-lg ${
              isUpgrade 
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}>
              <div className="flex items-start">
                <AlertTriangle className={`h-5 w-5 mr-3 ${
                  isUpgrade ? 'text-blue-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isUpgrade ? 'text-blue-900' : 'text-yellow-900'
                  }`}>
                    {isUpgrade ? 'Additional Cost' : 'Reduced Cost'}
                  </p>
                  <p className={`text-sm ${
                    isUpgrade ? 'text-blue-700' : 'text-yellow-700'
                  }`}>
                    {isUpgrade
                      ? `You will be charged an additional $${priceDifference} for the remainder of your billing period.`
                      : `Your new bill will be reduced by $${priceDifference} on your next billing date.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              const yearlyPrice = plan.price * 12 * 0.8;
              const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;
              
              return (
                <div 
                  key={plan.id}
                  className={`border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500 dark:ring-indigo-400 transform scale-105 shadow-lg' 
                      : hoveredPlanId === plan.id
                        ? 'border-indigo-300 dark:border-indigo-700 shadow-md transform scale-102'
                        : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                  onMouseEnter={() => setHoveredPlanId(plan.id)}
                  onMouseLeave={() => setHoveredPlanId(null)}
                >
                  {plan.popular && (
                    <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 text-center">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6 relative">
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${displayPrice.toFixed(2)}
                      </span>
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Downgrade Warning */}
          {selectedPlan && currentPlan && !isUpgrade && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-900">
                    Before you downgrade
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You'll lose access to some features immediately. Make sure you've:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Backed up any important data</li>
                      <li>Completed any pending operations</li>
                      <li>Informed your team members</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={isUpgrade ? 'primary' : 'danger'}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!selectedPlan}
          >
            {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}