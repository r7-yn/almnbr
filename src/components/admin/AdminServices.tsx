
import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const AdminServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { data: services, isLoading } = useServices();
  const queryClient = useQueryClient();

  const handleDelete = async (serviceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast.success('تم حذف الخدمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error: any) {
      toast.error('خطأ في حذف الخدمة: ' + error.message);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-almanbar-navy">إدارة الخدمات</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-almanbar-gold hover:bg-almanbar-gold-dark text-almanbar-navy"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            queryClient.invalidateQueries({ queryKey: ['services'] });
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-almanbar-navy">{service.title_ar}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-2">{service.title_en}</p>
              <p className="text-gray-500 text-xs">{service.description_ar.substring(0, 100)}...</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${
                  service.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.featured ? 'مميز' : 'عادي'}
                </span>
                <span className="text-xs text-gray-500">ترتيب: {service.display_order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
