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
  const [showToolbar, setShowToolbar] = useState(true);
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
      const maxHeight = window.innerWidth < 640 ? 150 : 200; // Smaller max height on mobile
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  };

  const debouncedAdjustHeight = debounce(adjustTextareaHeight, 100);

  useEffect(() => {
    debouncedAdjustHeight();
    // Hide toolbar on mobile when typing to save space
    if (window.innerWidth < 640 && message.length > 0) {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
  }, [message]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t bg-white dark:bg-slate-700 px-2 sm:px-4 py-2 sm:py-3">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative rounded-lg border ${
            isFocused
              ? 'border-indigo-500 ring-2 ring-indigo-200'
              : 'border-gray-300'
          } bg-white dark:bg-gray-600 transition-all duration-200`}>
            
            {/* Toolbar - Hidden on mobile when typing */}
            {showToolbar && (
              <div className="absolute left-2 top-3 flex items-center space-x-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Add emoji"
                >
                  <Smile className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              className={`w-full resize-none bg-white dark:bg-gray-600 dark:text-white rounded-lg py-2 sm:py-3 ${
                showToolbar ? 'pl-10 sm:pl-12' : 'pl-3'
              } pr-[110px] sm:pr-[140px] focus:outline-none text-sm sm:text-base`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 flex items-center space-x-1 sm:space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  console.log('File selected:', e.target.files?.[0]);
                }}
              />
              
              <button
                type="button"
                onClick={handleFileClick}
                className="rounded p-1 sm:p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Attach file"
              >
                <Paperclip className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>

              <button
                type="button"
                className="rounded p-1 sm:p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Record voice message"
              >
                <Mic className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>

              <Button
                type="submit"
                disabled={!message.trim() || isLoading}
                isLoading={isLoading}
                className="!h-8 sm:!h-9 min-w-[70px] sm:min-w-[80px] rounded-full text-sm sm:text-base"
              >
                {isLoading ? (
                  'Sending...'
                ) : (
                  <span className="flex items-center justify-center">
                    Send
                    <Send className="ml-1 sm:ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
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

        {/* Typing Indicator */}
        {isLoading && (
          <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="ml-2">AI is typing...</span>
          </div>
        )}
      </div>
    </div>
  );
}