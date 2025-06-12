
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdminServices } from '@/components/admin/AdminServices';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminPartners } from '@/components/admin/AdminPartners';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { LogOut, Settings, FileText, Users, Briefcase, MessageSquare } from 'lucide-react';

const Admin = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-almanbar-gold"></div>
      </div>
    );
  }

  if (!user ) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-almanbar-navy">لوحة التحكم - عالم المنير</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">مرحباً، {user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الخدمات
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              الشركاء
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              الرسائل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <AdminServices />
          </TabsContent>

          <TabsContent value="projects">
            <AdminProjects />
          </TabsContent>

          <TabsContent value="partners">
            <AdminPartners />
          </TabsContent>

          <TabsContent value="messages">
            <AdminMessages />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
