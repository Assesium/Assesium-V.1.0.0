import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2 } from 'lucide-react';
import { institutions } from '../data/institutions';

interface Institution {
  id: number;
  name: string;
  country: string;
}

interface InstitutionSelectorProps {
  onSelect: (institution: Institution) => void;
  selectedInstitution?: string;
  placeholder?: string;
  className?: string;
}

export default function InstitutionSelector({
  onSelect,
  selectedInstitution = '',
  placeholder = 'Search institutions...',
  className = ''
}: InstitutionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState(selectedInstitution);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const searchResults = searchTerm.length > 0 
    ? institutions.filter(inst => inst.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  // Handle click outside of search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectInstitution = (institution: Institution) => {
    setSearchTerm(institution.name);
    setShowDropdown(false);
    onSelect(institution);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          className="pl-10 w-full border dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() => setShowDropdown(searchTerm.length > 0)}
        />
      </div>
      
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map(inst => (
            <div 
              key={inst.id} 
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSelectInstitution(inst)}
            >
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{inst.country}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}