
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client when environment variables are missing
const createMockClient = () => ({
  from: () => ({
    insert: () => ({
      select: () => ({
        single: () => Promise.reject(new Error('Supabase not configured'))
      })
    })
  })
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Database types
export interface ContactSubmission {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

export interface NewsletterSignup {
  id?: string;
  email: string;
  created_at?: string;
}

// Database functions
export const saveContactSubmission = async (data: Omit<ContactSubmission, 'id' | 'created_at'>) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Contact form submission (Supabase not configured):', data);
    // Return a mock successful response
    return { id: 'mock-id', ...data, created_at: new Date().toISOString() };
  }

  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error saving contact submission:', error);
    throw error;
  }

  return result;
};

export const saveNewsletterSignup = async (email: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Newsletter signup (Supabase not configured):', email);
    // Return a mock successful response
    return { id: 'mock-id', email, created_at: new Date().toISOString() };
  }

  const { data: result, error } = await supabase
    .from('newsletter_signups')
    .insert([{ email }])
    .select()
    .single();

  if (error) {
    console.error('Error saving newsletter signup:', error);
    throw error;
  }

  return result;
};
