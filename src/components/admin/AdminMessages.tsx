
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const AdminMessages = () => {
  const queryClient = useQueryClient();
  
  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) throw error;

      toast.success('تم تحديث حالة الرسالة');
      queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
    } catch (error: any) {
      toast.error('خطأ في تحديث الرسالة: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'read': return 'مقروء';
      case 'replied': return 'تم الرد';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-almanbar-navy">رسائل التواصل</h2>
        <div className="text-sm text-gray-600">
          إجمالي الرسائل: {messages?.length || 0}
        </div>
      </div>

      <div className="grid gap-6">
        {messages?.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-almanbar-navy">
                  {message.subject || 'بدون موضوع'}
                </CardTitle>
                <Badge className={getStatusColor(message.status)}>
                  {getStatusText(message.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {message.name}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {message.email}
                </div>
                {message.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {message.phone}
                  </div>
                )}
                <div className="ml-auto">
                  {new Date(message.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {message.message}
              </p>
              
              <div className="flex gap-2">
                {message.status === 'new' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMessageStatus(message.id, 'read')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    تحديد كمقروء
                  </Button>
                )}
                {message.status === 'read' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMessageStatus(message.id, 'replied')}
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    تحديد كمجاب عليه
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMessageStatus(message.id, 'archived')}
                  className="text-gray-600"
                >
                  أرشفة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {!messages?.length && (
          <div className="text-center py-12 text-gray-500">
            لا توجد رسائل حتى الآن
          </div>
        )}
      </div>
    </div>
  );
};
