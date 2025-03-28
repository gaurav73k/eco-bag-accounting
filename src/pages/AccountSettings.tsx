
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, User, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';
import RoleManagement from '@/components/RoleManagement';
import { useAuth } from '@/contexts/AuthContext';

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@example.com',
    phone: '+977 9812345678',
    company: 'Om Ganapati Bag Udhyog',
    position: 'Owner',
  });

  const [companyData, setCompanyData] = useState({
    companyName: 'Om Ganapati Bag Udhyog',
    address: 'Kathmandu, Nepal',
    phone: '01-4567890',
    email: 'info@omganapatibag.com',
    taxId: '12345-67890',
    website: 'www.omganapatibag.com',
    fiscalYear: 'Shrawan - Ashad',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCompanyChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const saveCompanyInfo = () => {
    toast.success("Company information updated successfully");
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    toast.success("Password changed successfully");
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Account Settings" 
          description="Manage your account and system settings"
          icon={<Settings className="h-6 w-6" />}
        />
        
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="company">
                <Settings className="h-4 w-4 mr-2" />
                Company Info
              </TabsTrigger>
              <TabsTrigger value="security">
                <Key className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="roles">
                <Shield className="h-4 w-4 mr-2" />
                Access Control
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={handleProfileChange('name')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        value={profileData.email}
                        onChange={handleProfileChange('email')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={handleProfileChange('phone')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input 
                        id="position" 
                        value={profileData.position}
                        onChange={handleProfileChange('position')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        value={profileData.company}
                        onChange={handleProfileChange('company')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your company details used on invoices and reports.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={companyData.companyName}
                        onChange={handleCompanyChange('companyName')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Address</Label>
                      <Input 
                        id="companyAddress" 
                        value={companyData.address}
                        onChange={handleCompanyChange('address')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Phone</Label>
                      <Input 
                        id="companyPhone" 
                        value={companyData.phone}
                        onChange={handleCompanyChange('phone')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input 
                        id="companyEmail" 
                        value={companyData.email}
                        onChange={handleCompanyChange('email')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / PAN</Label>
                      <Input 
                        id="taxId" 
                        value={companyData.taxId}
                        onChange={handleCompanyChange('taxId')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        value={companyData.website}
                        onChange={handleCompanyChange('website')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fiscalYear">Fiscal Year</Label>
                      <Input 
                        id="fiscalYear" 
                        value={companyData.fiscalYear}
                        onChange={handleCompanyChange('fiscalYear')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveCompanyInfo}>
                      Save Company Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange('currentPassword')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange('newPassword')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange('confirmPassword')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={changePassword}>
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;
