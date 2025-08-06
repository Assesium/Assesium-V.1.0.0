import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import Button from './Button';

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
    price: 499,
    period: 'year',
    features: [
      'Up to 500 students',
      'Basic AI grading',
      'Standard reports',
      'Email support',
      '5 admin users'
    ],
    color: 'blue'
  },
  {
    id: 'professional',
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
    color: 'indigo',
    popular: true
  },
  {
    id: 'enterprise',
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
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
    
    // Adjust price for monthly billing (divide by 12)
    const finalPlan = {
      ...selectedPlan,
      price: billingCycle === 'monthly' ? selectedPlan.price / 12 : selectedPlan.price,
      period: billingCycle === 'monthly' ? 'month' : 'year'
    };
    
    // Simulate API call
    setTimeout(() => {
      onConfirm(finalPlan);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  // Check if a plan is the current plan
  const isPlanCurrent = (plan: SubscriptionPlan) => {
    return currentPlan?.id === plan.id;
  };
  
  // Check if a plan is selected
  const isPlanSelected = (plan: SubscriptionPlan) => {
    return selectedPlan?.id === plan.id;
  };

  // Format price based on billing cycle
  const formatPrice = (price: number) => {
    if (billingCycle === 'monthly') {
      return `$${Math.round(price / 12)}`;
    }
    return `$${price}`;
  };

  // Get background color based on plan ID
  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic': return 'bg-blue-500';
      case 'professional': return 'bg-indigo-500';
      case 'enterprise': return 'bg-pink-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Plans
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${billingCycle === 'monthly' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-500'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${billingCycle === 'yearly' 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-500'}`}
            >
              Yearly Billing
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Tabs - Horizontal Layout */}
        <div className="mb-8">
          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-1"></div>
            {availablePlans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                className={`col-span-1 p-4 text-center cursor-pointer rounded-t-lg transition-all ${selectedPlan?.id === plan.id ? 'bg-blue-50 border-t border-l border-r border-blue-200' : 'bg-gray-50 border-t border-l border-r border-gray-200'}`}
              >
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center mt-2">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                  <span className="text-sm text-gray-500 ml-1">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
                {plan.popular && (
                  <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block">
                    Most Popular
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Feature Comparison */}
          <div className="border rounded-lg overflow-hidden">
            {/* Feature rows */}
            {[
              'Students',
              'AI Grading',
              'Reports',
              'Support',
              'Admin Users',
              'Data Export',
              'API Access',
              'Custom Integrations'
            ].map((feature, index) => (
              <div key={index} className={`grid grid-cols-4 gap-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="col-span-1 p-4 font-medium text-gray-700">{feature}</div>
                {availablePlans.map((plan) => {
                  // Determine if this plan has this feature
                  const hasFeature = plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
                  // Get the specific feature text if it exists
                  const featureText = plan.features.find(f => f.toLowerCase().includes(feature.toLowerCase()));
                  
                  return (
                    <div 
                      key={plan.id} 
                      className={`col-span-1 p-4 text-center ${selectedPlan?.id === plan.id ? 'bg-blue-50' : ''}`}
                    >
                      {hasFeature ? (
                        <div className="flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">{featureText?.replace(feature, '').trim() || 'Yes'}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Plan Selection Buttons */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="col-span-1"></div>
          {availablePlans.map((plan) => {
            const isCurrent = isPlanCurrent(plan);
            const isSelected = isPlanSelected(plan);
            
            return (
              <div key={plan.id} className="col-span-1 text-center">
                <Button
                  type="button"
                  variant={isSelected ? "primary" : "outline"}
                  className={`w-full ${isCurrent ? 'bg-green-600 hover:bg-green-700 border-green-600' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {isCurrent && !isSelected ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedPlan || (selectedPlan.id === currentPlan?.id) || isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Selection'}
          </Button>
        </div>
      </div>
    </div>
  );
}