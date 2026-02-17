import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface TenantSetting {
  id: string;
  tenant_id: string;
  key: string;
  value: unknown;
}

export function useTenantMembers() {
  const { tenant } = useTenant();
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    if (!tenant) return;

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tenant_members')
        .select(`
          *,
          user:user_profiles(id, name, avatar_url, role)
        `)
        .eq('tenant_id', tenant.id)
        .order('joined_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching tenant members:', err);
      setError('Failed to load members');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  const addMember = async (userId: string, role: string = 'member') => {
    if (!tenant) return { success: false, error: 'No tenant selected' };

    try {
      const { error: insertError } = await supabase
        .from('tenant_members')
        .insert({
          tenant_id: tenant.id,
          user_id: userId,
          role,
        });

      if (insertError) throw insertError;
      await fetchMembers();
      return { success: true };
    } catch (err) {
      console.error('Error adding member:', err);
      return { success: false, error: 'Failed to add member' };
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const { error: updateError } = await supabase
        .from('tenant_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (updateError) throw updateError;
      await fetchMembers();
      return { success: true };
    } catch (err) {
      console.error('Error updating member role:', err);
      return { success: false, error: 'Failed to update role' };
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tenant_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;
      await fetchMembers();
      return { success: true };
    } catch (err) {
      console.error('Error removing member:', err);
      return { success: false, error: 'Failed to remove member' };
    }
  };

  return {
    members,
    isLoading,
    error,
    addMember,
    updateMemberRole,
    removeMember,
    refetch: fetchMembers,
  };
}

export function useTenantSettings() {
  const { tenant } = useTenant();
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSettings = useCallback(async () => {
    if (!tenant) return;

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tenant_settings')
        .select('*')
        .eq('tenant_id', tenant.id);

      if (fetchError) throw fetchError;

      const settingsMap: Record<string, unknown> = {};
      (data || []).forEach((setting: TenantSetting) => {
        settingsMap[setting.key] = setting.value;
      });
      setSettings(settingsMap);
    } catch (err) {
      console.error('Error fetching tenant settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  const updateSetting = async (key: string, value: unknown) => {
    if (!tenant) return { success: false, error: 'No tenant selected' };

    try {
      // First try to find existing setting
      const { data: existing } = await supabase
        .from('tenant_settings')
        .select('id')
        .eq('tenant_id', tenant.id)
        .eq('key', key)
        .single();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('tenant_settings')
          .update({
            value: value as never,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('tenant_settings')
          .insert({
            tenant_id: tenant.id,
            key,
            value: value as never,
          });
        if (insertError) throw insertError;
      }

      await fetchSettings();
      return { success: true };
    } catch (err) {
      console.error('Error updating setting:', err);
      return { success: false, error: 'Failed to update setting' };
    }
  };

  const getSetting = <T,>(key: string, defaultValue: T): T => {
    return (settings[key] as T) ?? defaultValue;
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    getSetting,
    refetch: fetchSettings,
  };
}

export function useAllTenants() {
  const [tenants, setTenants] = useState<Array<{
    id: string;
    slug: string;
    name: string;
    country_code: string;
    status: string;
    is_headquarters: boolean;
    logo_url: string | null;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('tenants')
          .select('id, slug, name, country_code, status, is_headquarters, logo_url')
          .eq('status', 'active')
          .order('is_headquarters', { ascending: false })
          .order('name');

        if (fetchError) throw fetchError;
        setTenants(data || []);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load organizations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tenants, isLoading, error };
}
