import React from 'react';
import { X, Calendar, Building2, CreditCard, FileText, Download } from 'lucide-react';
import Button from '../Button';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  status: string;
  description: string;
  institution: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'Completed' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Institution: {transaction.institution}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Transaction ID: #{transaction.id}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Payment Method: Credit Card
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              icon={() => <Download className="h-4 w-4" />}
            >
              Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}