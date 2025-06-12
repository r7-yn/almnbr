
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceFormProps {
  service?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const ServiceForm = ({ service, onClose, onSuccess }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    title_ar: service?.title_ar || '',
    title_en: service?.title_en || '',
    description_ar: service?.description_ar || '',
    description_en: service?.description_en || '',
    short_description_ar: service?.short_description_ar || '',
    short_description_en: service?.short_description_en || '',
    icon_name: service?.icon_name || 'Camera',
    image_url: service?.image_url || '',
    featured: service?.featured || false,
    display_order: service?.display_order || 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', service.id);

        if (error) throw error;
        toast.success('تم تحديث الخدمة بنجاح');
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم إضافة الخدمة بنجاح');
      }

      onSuccess();
    } catch (error: any) {
      toast.error('خطأ في حفظ الخدمة: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const iconOptions = ['Camera', 'Video', 'Target', 'Palette', 'Monitor', 'TrendingUp'];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-almanbar-navy">
          {service ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_ar">العنوان بالعربية</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleChange('title_ar', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleChange('description_ar', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="icon_name">الأيقونة</Label>
              <select
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => handleChange('icon_name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="display_order">ترتيب العرض</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
              <Label htmlFor="featured">خدمة مميزة</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">رابط الصورة</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-almanbar-gold hover:bg-almanbar-gold-dark text-almanbar-navy"
            >
              {isLoading ? 'جارٍ الحفظ...' : (service ? 'تحديث' : 'إضافة')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
