/**
 * UNIFIED ACCESS SCREEN
 * World-class entry point for BOTH new and returning users
 * No marketing, no redundancy, just calm access
 */

import { useState } from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import logo from 'figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png';

interface UnifiedAccessScreenProps {
  onContinue: (phone: string, isReturning: boolean) => void;
  language: 'en' | 'sw';
}

export function UnifiedAccessScreen({ onContinue, language }: UnifiedAccessScreenProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const copy = {
    en: {
      tagline: 'Smart farming, simple payments',
      phoneLabel: 'Phone number',
      phonePlaceholder: '712 345 678',
      continue: 'Continue',
      returning: 'Already registered? Log in',
    },
    sw: {
      tagline: 'Kilimo mahiri, malipo rahisi',
      phoneLabel: 'Namba ya simu',
      phonePlaceholder: '712 345 678',
      continue: 'Endelea',
      returning: 'Umeshasajili? Ingia',
    }
  };

  const t = copy[language];

  // Auto-format phone as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    // Format: XXX XXX XXX
    if (value.length > 6) {
      value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3)}`;
    }
    
    setPhone(value);
  };

  // Validate phone number
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, '');
    return /^[67]\d{8}$/.test(cleaned);
  };

  const handleContinue = async () => {
    if (!validatePhone(phone)) return;
    
    setLoading(true);
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Check if user exists (backend call)
    // For now, simulate by checking localStorage
    const existingUser = localStorage.getItem('kilimoUser');
    const isReturning = existingUser ? JSON.parse(existingUser).phone?.includes(cleanPhone) : false;
    
    setTimeout(() => {
      onContinue(`+255${cleanPhone}`, isReturning);
      setLoading(false);
    }, 500);
  };

  return (
    <></>
  );
}