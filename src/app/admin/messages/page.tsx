'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  MessageSquare,
  Mail,
  Calendar,
  Trash2,
  CheckCircle,
  Eye,
  X,
} from 'lucide-react';

interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchMessages();
  }, [session, fetchMessages]);

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, read } : msg))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => prev ? { ...prev, read } : null);
        }
        toast.success(read ? 'Marked as read' : 'Marked as unread');
      } else {
        toast.error('Failed to update message status');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted!');
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } else {
        toast.error('Failed to delete message');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleView = (msg: IMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleMarkRead(msg._id, true);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
          Messages
        </h1>
        <p className="text-muted-foreground mt-1">
          Review submissions from your contact form
        </p>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="anime-card rounded-2xl p-5 animate-pulse h-20"
            />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Your inbox is empty. No messages yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inbox List */}
          <div className="lg:col-span-2 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleView(msg)}
                className={`anime-card rounded-2xl p-4 cursor-pointer hover:border-primary/45 transition border flex items-center justify-between gap-4 ${
                  !msg.read ? 'border-primary/30 bg-primary/5' : 'border-border/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm truncate">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground font-semibold rounded-full uppercase shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMarkRead(msg._id, !msg.read)}
                    title={msg.read ? 'Mark unread' : 'Mark read'}
                    className={`p-1.5 rounded-lg transition cursor-pointer hover:bg-muted ${
                      msg.read ? 'text-muted-foreground hover:text-primary' : 'text-primary'
                    }`}
                  >
                    <CheckCircle className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    title="Delete message"
                    className="p-1.5 rounded-lg transition cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Details Panel / Modal for Selected Message */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="anime-card rounded-2xl p-6 sticky top-28 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-xl space-y-1 text-sm border border-border/30">
                  <div className="text-muted-foreground">
                    From: <span className="font-semibold text-foreground">{selectedMessage.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Email:{' '}
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pt-2">
                  {selectedMessage.message}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => handleMarkRead(selectedMessage._id, !selectedMessage.read)}
                    className="px-3.5 py-1.5 bg-muted text-foreground hover:bg-muted/80 rounded-xl transition text-xs font-semibold cursor-pointer"
                  >
                    Mark as {selectedMessage.read ? 'Unread' : 'Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="px-3.5 py-1.5 bg-destructive/15 text-destructive hover:bg-destructive/25 rounded-xl transition text-xs font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="anime-card rounded-2xl p-8 sticky top-28 text-center border border-dashed border-border/60">
                <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">Select a message from the list to view full details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
