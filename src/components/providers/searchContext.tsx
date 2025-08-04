'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

export const searchContext = createContext({
  searchResult: '',
  setSearchResult: (_result: string) => {
    // Default empty implementation
  },
});

export const useSearch = () => useContext(searchContext);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchResult, setSearchResult] = useState<string>('');
  return (
    <searchContext.Provider value={{ searchResult, setSearchResult }}>
      {children}
    </searchContext.Provider>
  );
}
