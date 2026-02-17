'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tenant as DBTenant } from '@/types/database';

// Extended tenant type with proper typing for features
interface Tenant extends Omit<DBTenant, 'settings' | 'features'> {
  settings: Record<string, unknown> | null;
  features: {
    voting?: boolean;
    community?: boolean;
    nomination?: boolean;
  } | null;
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  setTenantBySlug: (slug: string) => Promise<void>;
  setTenantByDomain: (domain: string) => Promise<void>;
  isHeadquarters: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Detect tenant from domain or URL on initial load
  useEffect(() => {
    const detectTenant = async () => {
      try {
        setIsLoading(true);
        const hostname = window.location.hostname;

        // Check for custom domain first
        const { data: tenantByDomain } = await supabase
          .from('tenants')
          .select('*')
          .eq('custom_domain', hostname)
          .eq('status', 'active')
          .single();

        if (tenantByDomain) {
          setTenant(tenantByDomain as Tenant);
          return;
        }

        // Check for subdomain pattern (e.g., us.happysociety.org)
        const parts = hostname.split('.');
        if (parts.length >= 3) {
          const potentialSlug = parts[0];
          const { data: tenantBySlug } = await supabase
            .from('tenants')
            .select('*')
            .eq('slug', potentialSlug)
            .eq('status', 'active')
            .single();

          if (tenantBySlug) {
            setTenant(tenantBySlug as Tenant);
            return;
          }
        }

        // Default to headquarters (Korea)
        const { data: headquarters } = await supabase
          .from('tenants')
          .select('*')
          .eq('is_headquarters', true)
          .single();

        if (headquarters) {
          setTenant(headquarters as Tenant);
        }
      } catch (err) {
        console.error('Error detecting tenant:', err);
        setError('Failed to detect organization');
      } finally {
        setIsLoading(false);
      }
    };

    detectTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTenantBySlug = async (slug: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (fetchError) throw fetchError;
      setTenant(data as Tenant);
    } catch (err) {
      console.error('Error setting tenant by slug:', err);
      setError('Organization not found');
    } finally {
      setIsLoading(false);
    }
  };

  const setTenantByDomain = async (domain: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .eq('custom_domain', domain)
        .eq('status', 'active')
        .single();

      if (fetchError) throw fetchError;
      setTenant(data as Tenant);
    } catch (err) {
      console.error('Error setting tenant by domain:', err);
      setError('Organization not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        error,
        setTenantBySlug,
        setTenantByDomain,
        isHeadquarters: tenant?.is_headquarters ?? false,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
