'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useAllTenants } from '@/hooks/useTenantData';

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  KR: '\uD83C\uDDF0\uD83C\uDDF7',
  US: '\uD83C\uDDFA\uD83C\uDDF8',
  JP: '\uD83C\uDDEF\uD83C\uDDF5',
  GB: '\uD83C\uDDEC\uD83C\uDDE7',
  DE: '\uD83C\uDDE9\uD83C\uDDEA',
  FR: '\uD83C\uDDEB\uD83C\uDDF7',
  CA: '\uD83C\uDDE8\uD83C\uDDE6',
  AU: '\uD83C\uDDE6\uD83C\uDDFA',
  NZ: '\uD83C\uDDF3\uD83C\uDDFF',
  SG: '\uD83C\uDDF8\uD83C\uDDEC',
  HK: '\uD83C\uDDED\uD83C\uDDF0',
  TW: '\uD83C\uDDF9\uD83C\uDDFC',
  // Add more as needed
};

interface TenantSelectorProps {
  variant?: 'default' | 'compact';
  showLabel?: boolean;
}

export function TenantSelector({ variant = 'default', showLabel = true }: TenantSelectorProps) {
  const { tenant, setTenantBySlug, isLoading: tenantLoading } = useTenant();
  const { tenants, isLoading: tenantsLoading } = useAllTenants();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTenantChange = async (slug: string) => {
    await setTenantBySlug(slug);
    setIsOpen(false);

    // Optionally redirect to the tenant's domain/subdomain
    // window.location.href = `https://${slug}.happysociety.org`;
  };

  if (tenantLoading || tenantsLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
        <Globe className="w-4 h-4 animate-pulse" />
        {showLabel && <span className="hidden sm:inline">Loading...</span>}
      </div>
    );
  }

  // Only show selector if there are multiple tenants
  if (tenants.length <= 1) {
    return null;
  }

  const currentFlag = tenant?.country_code ? countryFlags[tenant.country_code] || '\uD83C\uDF0D' : '\uD83C\uDF0D';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors ${
          variant === 'compact' ? 'px-2 py-1.5' : 'px-3 py-2'
        }`}
        aria-label="Select organization"
      >
        <span className="text-lg">{currentFlag}</span>
        {showLabel && (
          <>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {tenant?.name || 'Select Organization'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Select Chapter
          </div>
          {tenants.map((t) => {
            const flag = countryFlags[t.country_code] || '\uD83C\uDF0D';
            const isSelected = tenant?.id === t.id;

            return (
              <button
                key={t.id}
                onClick={() => handleTenantChange(t.slug)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 ${
                  isSelected ? 'bg-primary-50' : ''
                }`}
              >
                <span className="text-lg">{flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${isSelected ? 'text-primary-600' : 'text-gray-900'}`}>
                    {t.name}
                  </div>
                  {t.is_headquarters && (
                    <div className="text-xs text-gray-500">Headquarters</div>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
