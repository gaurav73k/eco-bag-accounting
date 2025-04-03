
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAppSettings, updateAppSettings, uploadLogo, uploadFavicon, AppSettings } from '@/lib/supabase';
import { toast } from 'sonner';

type SettingsContextType = {
  settings: AppSettings | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  uploadNewLogo: (file: File) => Promise<void>;
  uploadNewFavicon: (file: File) => Promise<void>;
  applyFavicon: (url: string) => void;
  applySettings: (settings: AppSettings) => void;
};

const defaultSettings: AppSettings = {
  site_title: 'Om Ganapati Bag Udhyog',
  logo_url: null,
  favicon_url: null,
  primary_color: '#9b87f5',
  secondary_color: '#7E69AB',
  font_family: 'Inter, sans-serif',
  company_name: 'Om Ganapati Bag Udhyog',
  company_address: 'Kathmandu, Nepal',
  company_phone: '',
  company_email: '',
  tax_number: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        console.log('Loading settings from Supabase...');
        const data = await getAppSettings();
        
        if (data) {
          console.log('Settings loaded:', data);
          // Ensure the data matches our AppSettings type
          const typedSettings: AppSettings = data as AppSettings;
          setSettings(typedSettings);
          // Apply settings to the UI
          applySettings(typedSettings);
          setInitialized(true);
        } else {
          console.log('No settings found in DB, using defaults');
          // If no settings in DB, use defaults
          setSettings(defaultSettings);
          // Create default settings in DB
          try {
            await updateAppSettings(defaultSettings);
            console.log('Default settings created in DB');
          } catch (err) {
            console.error('Error creating default settings:', err);
          }
          applySettings(defaultSettings);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
        applySettings(defaultSettings);
        setInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      if (!settings) return;
      
      const updatedSettings = { ...settings, ...newSettings };
      
      console.log('Updating settings:', updatedSettings);
      
      // First update the UI immediately for a responsive feel
      setSettings(updatedSettings);
      applySettings(updatedSettings);
      
      // Then update in the database
      await updateAppSettings(updatedSettings);
      console.log('Settings updated in DB successfully');
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    }
  };

  const uploadNewLogo = async (file: File) => {
    try {
      console.log('Uploading logo:', file.name);
      const logoUrl = await uploadLogo(file);
      console.log('Logo uploaded successfully:', logoUrl);
      await updateSettings({ logo_url: logoUrl });
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error('Error uploading logo:', error);
    }
  };

  const uploadNewFavicon = async (file: File) => {
    try {
      console.log('Uploading favicon:', file.name);
      const faviconUrl = await uploadFavicon(file);
      console.log('Favicon uploaded successfully:', faviconUrl);
      await updateSettings({ favicon_url: faviconUrl });
      applyFavicon(faviconUrl);
      toast.success('Favicon updated successfully');
    } catch (error) {
      toast.error('Failed to upload favicon');
      console.error('Error uploading favicon:', error);
    }
  };

  const applySettings = (settings: AppSettings) => {
    // Apply CSS variables for colors
    document.documentElement.style.setProperty('--primary', settings.primary_color);
    document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    
    // Convert hex colors to hsl for tailwind
    try {
      const primaryHexToHSL = hexToHSL(settings.primary_color);
      if (primaryHexToHSL) {
        document.documentElement.style.setProperty('--primary-hue', primaryHexToHSL.h.toString());
        document.documentElement.style.setProperty('--primary-saturation', `${primaryHexToHSL.s}%`);
        document.documentElement.style.setProperty('--primary-lightness', `${primaryHexToHSL.l}%`);
      }
      
      const secondaryHexToHSL = hexToHSL(settings.secondary_color);
      if (secondaryHexToHSL) {
        document.documentElement.style.setProperty('--secondary-hue', secondaryHexToHSL.h.toString());
        document.documentElement.style.setProperty('--secondary-saturation', `${secondaryHexToHSL.s}%`);
        document.documentElement.style.setProperty('--secondary-lightness', `${secondaryHexToHSL.l}%`);
      }
    } catch (error) {
      console.error('Error converting hex to HSL:', error);
    }
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', settings.font_family);
    
    // Set page title
    document.title = settings.site_title;
    
    // Apply favicon if exists
    if (settings.favicon_url) {
      applyFavicon(settings.favicon_url);
    }
    
    console.log('Applied settings to UI:', settings);
  };

  const applyFavicon = (url: string) => {
    // Update favicon link elements
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
    console.log('Applied favicon:', url);
  };
  
  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string) => {
    // Remove the # if it exists
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find the min and max values to calculate the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate the HSL values
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h *= 60;
    }
    
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  return (
    <SettingsContext.Provider 
      value={{
        settings,
        isLoading,
        updateSettings,
        uploadNewLogo,
        uploadNewFavicon,
        applyFavicon,
        applySettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
