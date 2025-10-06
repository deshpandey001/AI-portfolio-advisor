import { AlertCircle } from 'lucide-react';

interface ComplianceNoticeProps {
  message: string;
}

export function ComplianceNotice({ message }: ComplianceNoticeProps) {
  if (!message) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-600 rounded-lg flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Compliance Adjustment</h4>
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
