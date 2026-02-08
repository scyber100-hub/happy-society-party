// Event-related API functions
import { createBrowserClient } from '@supabase/ssr';

// Create a generic Supabase client for custom RPC calls
const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  location: string | null;
  online_url: string | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  current_participants: number;
  scope: 'national' | 'regional' | 'committee';
  scope_id: string | null;
  status: string;
  qr_code: string | null;
  qr_valid_from: string | null;
  qr_valid_until: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  attended_at: string | null;
  check_in_method: string | null;
  tenant_id: string | null;
}

export interface CheckInResult {
  success: boolean;
  error?: string;
  message: string;
  event?: {
    id: string;
    title: string;
    location: string | null;
  };
  check_in_time?: string;
  was_registered?: boolean;
}

// Generate QR code for an event (admin only)
export async function generateEventQRCode(eventId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('generate_event_qr_code', {
    p_event_id: eventId,
  });

  if (error) throw error;
  return data as string;
}

// Check in via QR code
export async function checkInWithQR(qrCode: string): Promise<CheckInResult> {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: 'not_authenticated',
      message: '로그인이 필요합니다',
    };
  }

  const { data, error } = await supabase.rpc('check_in_event_qr', {
    p_qr_code: qrCode,
    p_user_id: user.id,
  });

  if (error) {
    return {
      success: false,
      error: 'server_error',
      message: error.message,
    };
  }

  return data as CheckInResult;
}

// Sync offline check-in
export async function syncOfflineCheckIn(
  qrCode: string,
  deviceTimestamp: string
): Promise<CheckInResult> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: 'not_authenticated',
      message: '로그인이 필요합니다',
    };
  }

  const { data, error } = await supabase.rpc('check_in_event_offline', {
    p_qr_code: qrCode,
    p_user_id: user.id,
    p_device_timestamp: deviceTimestamp,
  });

  if (error) {
    return {
      success: false,
      error: 'server_error',
      message: error.message,
    };
  }

  return data as CheckInResult;
}

// Get event by QR code (for displaying event info before check-in)
export async function getEventByQRCode(qrCode: string): Promise<Event | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('qr_code', qrCode)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Event | null;
}

// Get user's event registration status
export async function getEventRegistration(
  eventId: string,
  userId: string
): Promise<EventParticipant | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('event_participants')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as EventParticipant | null;
}

// Register for an event
export async function registerForEvent(eventId: string): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('event_participants')
    .insert({
      event_id: eventId,
      user_id: user.id,
    });

  if (error) {
    console.error('Registration error:', error);
    return false;
  }

  // Update participant count
  await supabase.rpc('increment', {
    table_name: 'events',
    row_id: eventId,
    column_name: 'current_participants',
  });

  return true;
}

// Cancel event registration
export async function cancelEventRegistration(eventId: string): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .is('attended_at', null); // Can only cancel if not attended

  if (error) {
    console.error('Cancel error:', error);
    return false;
  }

  return true;
}

// Offline check-in storage using IndexedDB
const DB_NAME = 'hsp-offline';
const STORE_NAME = 'pending-checkins';

interface PendingCheckIn {
  id: string;
  qrCode: string;
  timestamp: string;
  synced: boolean;
}

export async function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveOfflineCheckIn(qrCode: string): Promise<string> {
  const db = await openOfflineDB();
  const id = crypto.randomUUID();
  const checkIn: PendingCheckIn = {
    id,
    qrCode,
    timestamp: new Date().toISOString(),
    synced: false,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(checkIn);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(id);
  });
}

export async function getPendingCheckIns(): Promise<PendingCheckIn[]> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const all = request.result as PendingCheckIn[];
      resolve(all.filter(c => !c.synced));
    };
  });
}

export async function markCheckInSynced(id: string): Promise<void> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const checkIn = getRequest.result as PendingCheckIn;
      if (checkIn) {
        checkIn.synced = true;
        const putRequest = store.put(checkIn);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      } else {
        resolve();
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function syncPendingCheckIns(): Promise<number> {
  const pending = await getPendingCheckIns();
  let synced = 0;

  for (const checkIn of pending) {
    try {
      const result = await syncOfflineCheckIn(checkIn.qrCode, checkIn.timestamp);
      if (result.success) {
        await markCheckInSynced(checkIn.id);
        synced++;
      }
    } catch (error) {
      console.error('Failed to sync check-in:', checkIn.id, error);
    }
  }

  return synced;
}
