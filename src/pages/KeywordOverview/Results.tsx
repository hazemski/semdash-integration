import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { locations } from '../../data/locations';
import { fetchKeywordOverview, fetchKeywordSerps } from '../../services/keywordOverview';
import { VolumeCard } from './VolumeCard';
import { DifficultyCard } from './DifficultyCard';
import { RelatedKeywordsCard } from './RelatedKeywordsCard';
import { HistoricalTable } from '../../pages/SerpChecker/HistoricalTable';
import { useCredits } from '../../hooks/useCredits';
import { ErrorState } from '../../components/shared/ErrorState';

export function KeywordOverviewResults() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<KeywordOverviewData | null>(null);
  const [serpData, setSerpData] = useState<any[]>([]);
  const [serpError, setSerpError] = useState<string | null>(null);
  const [isLoadingSERP, setIsLoadingSERP] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { checkCredits, deductUserCredits } = useCredits();

  const currentParams = {
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    language: searchParams.get('language') || ''
  };


  const locationName = locations.find(loc => 
    loc.code === currentParams.location
  )?.name || currentParams.location;

  const languageName = locations.find(loc => 
    loc.code === currentParams.location
  )?.languages.find(lang => 
    lang.code === currentParams.language
  )?.name || currentParams.language;

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('serp-tables-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      const newPosition = scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!currentParams.keyword || !currentParams.location || !currentParams.language) {
        return;
      }

      // Reset state for new search
      setData(null);
      setError(null);
      setSerpData([]);
      setSerpError(null);
      setHasInitialLoad(false);

      const hasCredits = await checkCredits(30);
      if (!hasCredits) return;
      
      setIsLoading(true);
      setIsLoadingSERP(true);
      setError(null);
      setSerpError(null);

      try {
        // Fetch both overview and SERP data in parallel
        const [overviewResult, serpResult] = await Promise.all([
          fetchKeywordOverview(
            currentParams.keyword,
            currentParams.location,
            currentParams.language
          ),
          fetchKeywordSerps(
          currentParams.keyword,
          currentParams.location,
          currentParams.language
          )
        ]);

        const deducted = await deductUserCredits(30, 'Keyword Overview');
        if (!deducted) {
          throw new Error('Failed to process credits');
        }

        setData(overviewResult);
        setSerpData(serpResult);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        setSerpError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingSERP(false);
        setHasInitialLoad(true);
      }
    };

    fetchData();
  }, [currentParams.keyword, currentParams.location, currentParams.language]); // Watch URL params directly

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Keyword Overview: {currentParams.keyword}
          </h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Database: {locationName}</span>
            <span>Language: {languageName}</span>
          </div>
        </div>

        {error ? (
          <ErrorState 
            title="No keyword data found"
            message="We couldn't find any data for this keyword. This could be because:"
            suggestions={[
              'The keyword has no search volume',
              'The keyword is too specific or niche',
              'The keyword was mistyped or does not exist'
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="h-[400px]">
              <VolumeCard 
                volume={data?.mainKeyword.searchVolume}
                monthlySearches={data?.mainKeyword.monthlySearches}
                intent={data?.mainKeyword.intent}
              />
            </div>
            <div className="h-[400px]">
              <DifficultyCard 
                difficulty={data?.mainKeyword.keywordDifficulty}
                referringDomains={data?.mainKeyword.referringDomains}
                backlinks={data?.mainKeyword.backlinks}
                mainDomainRanking={data?.mainKeyword.mainDomainRanking}
              />
            </div>
            <div className="h-[400px]">
              <RelatedKeywordsCard keywords={data?.relatedKeywords} />
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-50 dark:bg-gray-900 w-full overflow-hidden">
          <div className="w-full py-8">
            <div className="relative">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 px-4">
                SERP History
              </h2>

              <button
                onClick={() => handleScroll('left')}
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleScroll('right')}
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div 
                id="serp-tables-container"
                className="overflow-x-auto hide-scrollbar w-full"
                style={{ scrollBehavior: 'smooth' }}
              >
                <HistoricalTable 
                  data={serpData}
                  isLoading={isLoadingSERP}
                  error={serpError}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
