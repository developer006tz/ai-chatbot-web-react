import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { Message } from '../types';

type DbMessage = Database['public']['Tables']['messages']['Row'];

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const mapDbMessageToMessage = (dbMessage: DbMessage): Message => {
    return {
      id: dbMessage.id,
      content: dbMessage.content,
      role: dbMessage.role,
      timestamp: new Date(dbMessage.created_at).getTime()
    };
  };

  const loadMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data.map(mapDbMessageToMessage));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!chatId) return;

    try {
      const timestamp = new Date().toISOString();
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          role: message.role,
          content: message.content,
          created_at: timestamp
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      const newMessage: Message = {
        id: data.id,
        content: data.content,
        role: data.role,
        timestamp: new Date(data.created_at).getTime()
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  return { messages, loading, loadMessages, addMessage, setMessages };
}