import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Sandbox Physicist Identity for Zero-Config Offline Testing
const SANDBOX_STORAGE_KEY = 'aeronull_active_user';

export const authService = {
  isConfigured: isSupabaseConfigured,

  /**
   * Get Current Session / Stored Physicist
   */
  async getCurrentUser() {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user || null;
    }

    try {
      const stored = localStorage.getItem(SANDBOX_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get Auth Bearer Token for API Requests
   */
  async getAuthToken() {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    }

    const localUser = await this.getCurrentUser();
    return localUser ? 'sandbox-guest-token' : null;
  },

  /**
   * Sign In with Email & Password
   */
  async signIn(email, password) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    }

    // Sandbox Simulation
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email,
      role: 'authenticated',
      user_metadata: {
        full_name: email.split('@')[0],
        institution: 'AeroNull Quantum Propulsion Lab',
      },
    };
    localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * Sign Up New Physicist
   */
  async signUp(email, password, fullName = 'Quantum Researcher') {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      return data.user;
    }

    const mockUser = {
      id: crypto.randomUUID(),
      email,
      role: 'authenticated',
      user_metadata: {
        full_name: fullName,
        institution: 'Independent Physics Institute',
      },
    };
    localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * 1-Click Guest Physicist Authorization (Instant Trial)
   */
  async signInGuest() {
    const guestUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'dr.vance.quantum@aeronull.org',
      role: 'authenticated',
      user_metadata: {
        full_name: 'Dr. Aurelius Vance (Guest Physicist)',
        institution: 'AeroNull Quantum Metric Group',
      },
    };
    localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  /**
   * Sign Out
   */
  async signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(SANDBOX_STORAGE_KEY);
  },

  /**
   * Auth Listener Subscription
   */
  onAuthStateChange(callback) {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
      });
      return () => subscription.unsubscribe();
    }

    const handleStorage = () => {
      this.getCurrentUser().then(callback);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  },
};
