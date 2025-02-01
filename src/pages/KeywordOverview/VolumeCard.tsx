import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/format';

interface VolumeCardProps {
  volume: number;
  monthlySearches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
  intent: string;
}

export function VolumeCard({ volume, monthlySearches = [], intent }: VolumeCardProps) {
  const chartData = [...monthlySearches]
    .sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1);
      const dateB = new Date(b.year, b.month - 1);
      return dateA.getTime() - dateB.getTime();
    })
    .map(item => ({
      date: new Date(item.year, item.month - 1),
      search_volume: item.search_volume
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-1">
            {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-sm text-gray-600">
            Search Volume: <span className="font-medium text-gray-900">{formatNumber(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  if (!volume && !monthlySearches) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="p-6 h-48 bg-gray-100 dark:bg-gray-700/50 rounded-b-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-6 flex-none">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">Volume</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-lg capitalize" style={{
            backgroundColor: intent === 'informational' ? '#EBF5FF' :
                           intent === 'commercial' ? '#F3E8FF' :
                           intent === 'navigational' ? '#DCFCE7' :
                           intent === 'transactional' ? '#FEF3C7' : '#F3F4F6',
            color: intent === 'informational' ? '#1E40AF' :
                   intent === 'commercial' ? '#6B21A8' :
                   intent === 'navigational' ? '#166534' :
                   intent === 'transactional' ? '#92400E' : '#374151'
          }}>
            {intent}
          </span>
        </div>

        <div className="text-3xl font-bold text-gray-900 mt-2">
          {formatNumber(volume)}
        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date"
              tickFormatter={(date: Date) => date.toLocaleDateString('default', { 
                month: 'short',
                year: '2-digit'
              })}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="search_volume"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 3, fill: '#60A5FA' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
