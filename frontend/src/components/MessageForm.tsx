import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface MessageFormProps {
  onSubmit: (message: string) => Promise<void>;
  disabled: boolean;
}

export default function MessageForm({ onSubmit, disabled }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(message);
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-midnight-400" />
        Store a Message
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm text-white/70 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message to store on the blockchain..."
            className="input w-full h-32 resize-none"
            disabled={disabled || submitting}
            maxLength={280}
          />
          <p className="text-white/50 text-xs mt-1">
            {message.length}/280 characters
          </p>
        </div>

        <div className="bg-midnight-500/10 border border-midnight-500/30 rounded-lg p-4">
          <p className="text-sm text-white/80">
            <strong>Note:</strong> This message will be stored on the Midnight blockchain
            using zero-knowledge proofs. The transaction requires tDUST for gas fees and
            will take approximately 10-30 seconds to complete.
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || submitting || !message.trim()}
          className="btn-primary w-full"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Transaction...
            </span>
          ) : (
            'Store Message on Blockchain'
          )}
        </button>
      </form>
    </div>
  );
}
