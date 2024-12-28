import { useState, useRef, useEffect } from 'react';
import { Button } from '../shared/Button';
import { debounce } from '../../utils/helpers';
import {
  Smile,
  Paperclip,
  Send,
  Mic,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const debouncedAdjustHeight = debounce(adjustTextareaHeight, 100);

  useEffect(() => {
    debouncedAdjustHeight();
  }, [message]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t bg-white px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          {/* Message Input Area */}
          <div
            className={`relative rounded-lg border ${
              isFocused
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : 'border-gray-300'
            } bg-white transition-all duration-200`}
          >
            {/* Toolbar */}
            <div className="absolute left-2 top-3 flex items-center space-x-2">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              className="w-full resize-none rounded-lg py-3 pl-12 pr-20 focus:outline-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  // Handle file upload logic here
                  console.log('File selected:', e.target.files?.[0]);
                }}
              />
              
              <button
                type="button"
                onClick={handleFileClick}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Record voice message"
              >
                <Mic className="h-5 w-5" />
              </button>

              <Button
                type="submit"
                disabled={!message.trim() || isLoading}
                isLoading={isLoading}
                className="!h-9 min-w-[80px] rounded-full"
              >
                {isLoading ? (
                  'Sending...'
                ) : (
                  <span className="flex items-center justify-center">
                    Send
                    <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Character Count */}
          {message.length > 0 && (
            <div className="mt-1 text-right">
              <span className="text-xs text-gray-500">
                {message.length} characters
              </span>
            </div>
          )}
        </form>

        {/* Typing Indicator (when AI is responding) */}
        {isLoading && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="ml-2">AI is typing...</span>
          </div>
        )}
      </div>
    </div>
  );
}