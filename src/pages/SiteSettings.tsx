
import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Upload, Palette, Type, Building, User, Save } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';

const SiteSettings = () => {
  const { settings, updateSettings, uploadNewLogo, uploadNewFavicon, isLoading } = useSettings();
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    site_title: settings?.site_title || '',
    company_name: settings?.company_name || '',
    company_address: settings?.company_address || '',
    company_phone: settings?.company_phone || '',
    company_email: settings?.company_email || '',
    tax_number: settings?.tax_number || '',
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    primary_color: settings?.primary_color || '#9b87f5',
    secondary_color: settings?.secondary_color || '#7E69AB',
    font_family: settings?.font_family || 'Inter, sans-serif',
  });
  
  // File upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  
  // Check permission
  const canEditSettings = hasPermission('manage_users');
  
  if (!canEditSettings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Permission Denied</CardTitle>
              <CardDescription>You don't have permission to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
  
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaviconFile(e.target.files[0]);
    }
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Update text settings
      await updateSettings({
        ...generalSettings,
        ...appearanceSettings
      });
      
      // Upload logo if selected
      if (logoFile) {
        await uploadNewLogo(logoFile);
      }
      
      // Upload favicon if selected
      if (faviconFile) {
        await uploadNewFavicon(faviconFile);
      }
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading settings...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PageTitle title="Site Settings" description="Customize your application appearance and information" />
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Site Configuration</CardTitle>
            <CardDescription>
              Manage how your site looks and functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">
                  <Building className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="branding">
                  <Upload className="h-4 w-4 mr-2" />
                  Branding
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      name="site_title"
                      value={generalSettings.site_title}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={generalSettings.company_name}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_address">Address</Label>
                    <Input
                      id="company_address"
                      name="company_address"
                      value={generalSettings.company_address}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone Number</Label>
                    <Input
                      id="company_phone"
                      name="company_phone"
                      value={generalSettings.company_phone}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      name="company_email"
                      type="email"
                      value={generalSettings.company_email}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax_number">Tax/VAT Number</Label>
                    <Input
                      id="tax_number"
                      name="tax_number"
                      value={generalSettings.tax_number}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Primary Color</Label>
                    <div className="flex space-x-4">
                      <Input
                        type="color"
                        name="primary_color"
                        value={appearanceSettings.primary_color}
                        onChange={handleAppearanceChange}
                        className="w-16 h-10"
                      />
                      <Input 
                        type="text"
                        name="primary_color"
                        value={appearanceSettings.primary_color}
                        onChange={handleAppearanceChange}
                        className="flex-1"
                      />
                    </div>
                    
                    <div className="h-20 rounded-md" style={{ backgroundColor: appearanceSettings.primary_color }}>
                      <div className="p-4 text-white">Primary Color Preview</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Secondary Color</Label>
                    <div className="flex space-x-4">
                      <Input
                        type="color"
                        name="secondary_color"
                        value={appearanceSettings.secondary_color}
                        onChange={handleAppearanceChange}
                        className="w-16 h-10"
                      />
                      <Input 
                        type="text"
                        name="secondary_color"
                        value={appearanceSettings.secondary_color}
                        onChange={handleAppearanceChange}
                        className="flex-1"
                      />
                    </div>
                    
                    <div className="h-20 rounded-md" style={{ backgroundColor: appearanceSettings.secondary_color }}>
                      <div className="p-4 text-white">Secondary Color Preview</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label htmlFor="font_family">Font Family</Label>
                  <Input
                    id="font_family"
                    name="font_family"
                    value={appearanceSettings.font_family}
                    onChange={handleAppearanceChange}
                    placeholder="e.g., 'Inter, sans-serif'"
                  />
                  
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Font Preview:</p>
                    <p className="text-2xl" style={{ fontFamily: appearanceSettings.font_family }}>
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="branding" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Company Logo</Label>
                    <div className="border rounded-md p-4 bg-muted/30 flex flex-col items-center justify-center">
                      {settings?.logo_url ? (
                        <div className="mb-4">
                          <img 
                            src={settings.logo_url} 
                            alt="Company Logo" 
                            className="max-h-24 max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center mb-4 text-muted-foreground">
                          <Upload className="h-16 w-16 mx-auto mb-2" />
                          <p>No logo uploaded</p>
                        </div>
                      )}
                      
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">
                          {settings?.logo_url ? 'Change Logo' : 'Upload Logo'}
                        </div>
                        <Input
                          id="logo-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </Label>
                      {logoFile && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Selected: {logoFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Favicon</Label>
                    <div className="border rounded-md p-4 bg-muted/30 flex flex-col items-center justify-center">
                      {settings?.favicon_url ? (
                        <div className="mb-4">
                          <img 
                            src={settings.favicon_url} 
                            alt="Favicon" 
                            className="max-h-12 max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center mb-4 text-muted-foreground">
                          <Upload className="h-12 w-12 mx-auto mb-2" />
                          <p>No favicon uploaded</p>
                        </div>
                      )}
                      
                      <Label htmlFor="favicon-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">
                          {settings?.favicon_url ? 'Change Favicon' : 'Upload Favicon'}
                        </div>
                        <Input
                          id="favicon-upload"
                          type="file"
                          className="hidden"
                          accept="image/png,image/x-icon,image/jpeg"
                          onChange={handleFaviconChange}
                        />
                      </Label>
                      {faviconFile && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Selected: {faviconFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default SiteSettings;
