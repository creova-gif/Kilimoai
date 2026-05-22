import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/src/lib/supabase';
import { Language } from '@/src/utils/translations';

export interface KilimoUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  region?: string;
  farmSize?: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  verified: boolean;
  onboardingCompleted: boolean;
}

interface AuthContextValue {
  user: KilimoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<KilimoUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KilimoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('sw');

  useEffect(() => {
    const init = async () => {
      try {
        const [savedLang, savedUser] = await Promise.all([
          AsyncStorage.getItem('kilimoLanguage'),
          AsyncStorage.getItem('kilimoUser'),
        ]);
        if (savedLang === 'en' || savedLang === 'sw') setLanguageState(savedLang);

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData: KilimoUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email || 'Farmer',
            role: session.user.user_metadata?.role || 'smallholder_farmer',
            tier: session.user.user_metadata?.tier || 'free',
            verified: true,
            onboardingCompleted: session.user.user_metadata?.onboarding_complete || false,
          };
          setUser(userData);
          await AsyncStorage.setItem('kilimoUser', JSON.stringify(userData));
        } else if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userData: KilimoUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email || 'Farmer',
          role: session.user.user_metadata?.role || 'smallholder_farmer',
          tier: session.user.user_metadata?.tier || 'free',
          verified: true,
          onboardingCompleted: session.user.user_metadata?.onboarding_complete || false,
        };
        setUser(userData);
        await AsyncStorage.setItem('kilimoUser', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('kilimoUser');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('kilimoLanguage', lang);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role, tier: 'free', onboarding_complete: false } },
    });
    if (error) throw error;
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  };

  const verifyOTP = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.multiRemove(['kilimoUser', 'kilimoMainActivity', 'kilimoPersonalization']);
    setUser(null);
  };

  const updateUser = async (data: Partial<KilimoUser>) => {
    const updated = { ...user, ...data } as KilimoUser;
    setUser(updated);
    await AsyncStorage.setItem('kilimoUser', JSON.stringify(updated));
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    language,
    setLanguage,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    verifyOTP,
    signOut,
    updateUser,
  }), [user, isLoading, language]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
