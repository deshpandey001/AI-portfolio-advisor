import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface AIExplanationProps {
  explanation: string;
}

export function AIExplanation({ explanation }: AIExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-2xl overflow-hidden border-2 border-blue-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-blue-100/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">AI-Generated Explanation</h3>
            <p className="text-sm text-gray-600">Personalized insights for your portfolio</p>
          </div>
        </div>
        <div className="p-2 rounded-full hover:bg-blue-200 transition-all">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-blue-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-blue-600" />
          )}
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg p-6 shadow-inner">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
