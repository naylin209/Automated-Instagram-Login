'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import useSWR from 'swr'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

const fetchProfile = async (userId) => {
  if (!userId) return null;
  console.log('Fetching profile for user:', userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  console.log('Profile fetch result:', { data, error });
  if (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
  return data;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // SWR for profile
  const { data: profile, error: profileError, mutate: mutateProfile, isValidating: profileLoading } = useSWR(
    user ? ['profile', user.id] : null,
    () => fetchProfile(user.id),
    { 
      revalidateOnFocus: true,
      onError: (error) => {
        console.error('SWR profile error:', error);
      },
      onSuccess: (data) => {
        console.log('SWR profile success:', data);
      }
    }
  );

  console.log('AuthContext state:', { 
    user: user?.id, 
    profile, 
    profileError, 
    profileLoading, 
    loading 
  });

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) return { error: 'Not logged in' }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) mutateProfile();
    return { data, error }
  }

  // Change password
  const changePassword = async (newPassword) => {
    if (!user) return { error: 'Not logged in' }
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    return { data, error }
  }

  const value = {
    user,
    profile,
    loading: loading || profileLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    mutateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 