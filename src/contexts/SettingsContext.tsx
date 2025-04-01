
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

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getAppSettings();
        
        if (data) {
          setSettings(data);
          // Apply settings to the UI
          applyTheme(data);
        } else {
          // If no settings in DB, use defaults
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings as AppSettings);
      
      // Apply the settings to the UI immediately
      applyTheme(updatedSettings as AppSettings);
      
      // Update in the database
      await updateAppSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    }
  };

  const uploadNewLogo = async (file: File) => {
    try {
      const logoUrl = await uploadLogo(file);
      await updateSettings({ logo_url: logoUrl });
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error('Error uploading logo:', error);
    }
  };

  const uploadNewFavicon = async (file: File) => {
    try {
      const faviconUrl = await uploadFavicon(file);
      await updateSettings({ favicon_url: faviconUrl });
      applyFavicon(faviconUrl);
      toast.success('Favicon updated successfully');
    } catch (error) {
      toast.error('Failed to upload favicon');
      console.error('Error uploading favicon:', error);
    }
  };

  const applyTheme = (settings: AppSettings) => {
    // Apply CSS variables for colors
    document.documentElement.style.setProperty('--primary', settings.primary_color);
    document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', settings.font_family);
    
    // Set page title
    document.title = settings.site_title;
    
    // Apply favicon if exists
    if (settings.favicon_url) {
      applyFavicon(settings.favicon_url);
    }
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
  };

  return (
    <SettingsContext.Provider 
      value={{
        settings,
        isLoading,
        updateSettings,
        uploadNewLogo,
        uploadNewFavicon,
        applyFavicon
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
