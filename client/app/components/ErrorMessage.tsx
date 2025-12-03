import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Something went wrong. Please try again.', 
  onRetry,
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-slate-50 z-50 px-4'
    : 'flex items-center justify-center py-12 px-4';

  return (
    <div className={containerClass}>
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Error</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
