import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://hsjxaxnenyomtgctungx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzanhheG5lbnlvbXRnY3R1bmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTYwMTksImV4cCI6MjA4MDg3MjAxOX0.yPxovU_iLql5LeQWTNJNzm9xIyu2tkXssoQtY1bOzpo';
export const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-ce1844e7`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
