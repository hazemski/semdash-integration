import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrafficShareForm } from './TrafficShareForm';

export function TrafficShare() {
  const navigate = useNavigate();

  const handleSearch = (keywords: string[], location: string, language: string, includeSubdomains: boolean) => {
    const searchParams = new URLSearchParams({
      keywords: JSON.stringify(keywords),
      location,
      language,
      includeSubdomains: includeSubdomains.toString()
    });
    navigate(`/traffic-share/results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Traffic Share Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Reveal and Analyze Your Competitors
          </p>
        </div>

        <TrafficShareForm onSearch={handleSearch} />
      </div>
    </div>
  );
}
