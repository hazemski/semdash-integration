import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '../../utils/format';
import { getDifficultyColor } from '../../utils/difficulty';

interface RelatedKeyword {
  keyword: string;
  searchVolume: number;
  cpc: number;
  keywordDifficulty: number;
  intent: string;
}

interface RelatedKeywordsCardProps {
  keywords: RelatedKeyword[];
}

export function RelatedKeywordsCard({ keywords = [] }: RelatedKeywordsCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(keywords.length / itemsPerPage);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const currentKeywords = keywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (!keywords) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-none">
        <h3 className="text-lg font-semibold text-gray-900">Related Keywords</h3>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Keyword
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Intent
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                KD
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Volume
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                CPC (USD)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
            {currentKeywords.map((keyword, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900 min-w-[200px]">
                  {keyword.keyword}
                </td>
                <td className="px-4 py-2 text-sm min-w-[100px]">
                  <span className="px-2 py-1 text-xs font-medium rounded-lg capitalize" style={{
                    backgroundColor: keyword.intent === 'informational' ? '#EBF5FF' :
                                   keyword.intent === 'commercial' ? '#F3E8FF' :
                                   keyword.intent === 'navigational' ? '#DCFCE7' :
                                   keyword.intent === 'transactional' ? '#FEF3C7' : '#F3F4F6',
                    color: keyword.intent === 'informational' ? '#1E40AF' :
                           keyword.intent === 'commercial' ? '#6B21A8' :
                           keyword.intent === 'navigational' ? '#166534' :
                           keyword.intent === 'transactional' ? '#92400E' : '#374151'
                  }}>
                    {keyword.intent.charAt(0)}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm min-w-[100px]">
                  <div className="flex items-center space-x-2">
                    <span>{Math.round(keyword.keywordDifficulty)}</span>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: getDifficultyColor(keyword.keywordDifficulty) }}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 min-w-[100px]">
                  {formatNumber(keyword.searchVolume)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 min-w-[100px]">
                  {formatCurrency(keyword.cpc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2 flex-none">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
