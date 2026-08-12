'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Quote } from 'lucide-react';
import { Comment } from '@/lib/enterprise/types';

interface EvidenceDiscussionThreadProps {
  targetType: 'CLUSTER' | 'INVESTIGATION';
  targetId: string;
  targetHeadline?: string;
}

export default function EvidenceDiscussionThread({
  targetType,
  targetId,
  targetHeadline
}: EvidenceDiscussionThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [quotedEvidence, setQuotedEvidence] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    let isMounted = true;

    async function loadComments() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setComments(data.comments || []);
          }
        }
      } catch (err) {
        console.error('[EvidenceDiscussionThread] Failed to fetch comments:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [targetType, targetId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          text,
          quotedEvidence
        })
      });

      if (res.ok) {
        setText('');
        setQuotedEvidence(undefined);
        const refreshRes = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setComments(data.comments || []);
        }
      }
    } catch (err) {
      console.error('[EvidenceDiscussionThread] Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs border-t border-zinc-900 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase text-zinc-200 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Evidence Discussions & Analyst Notes ({comments.length})
        </h4>

        {targetHeadline && !quotedEvidence && (
          <button
            onClick={() => setQuotedEvidence(targetHeadline)}
            className="text-[10px] text-indigo-400 hover:underline font-bold flex items-center gap-1"
          >
            <Quote className="w-3 h-3" />
            Quote Evidence Headline
          </button>
        )}
      </div>

      {/* Quoted Evidence Banner */}
      {quotedEvidence && (
        <div className="p-2.5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-indigo-300 text-[11px] font-sans">
          <span className="italic line-clamp-1">&quot;{quotedEvidence}&quot;</span>
          <button
            onClick={() => setQuotedEvidence(undefined)}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-[10px] ml-2"
          >
            Remove Quote
          </button>
        </div>
      )}

      {/* Post Comment Input */}
      <form onSubmit={handlePostComment} className="flex gap-2">
        <input
          type="text"
          placeholder="Post evidence discussion comment (use @username to mention analysts)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-700 font-sans"
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>

      {/* Comments Stream */}
      {isLoading ? (
        <div className="py-4 text-center text-zinc-500 text-xs">Loading evidence discussion thread...</div>
      ) : comments.length === 0 ? (
        <div className="p-4 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
          No analyst notes or discussion comments posted yet.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((cmt) => (
            <div key={cmt.id} className="p-3.5 rounded-lg border border-zinc-850 bg-zinc-900/30 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <strong className="text-zinc-200 font-bold">{cmt.authorName}</strong>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-900 border border-zinc-800 text-indigo-400 font-bold uppercase">
                    {cmt.authorRole}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-500">
                  {new Date(cmt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {cmt.quotedEvidence && (
                <div className="p-2 rounded bg-zinc-950 border border-zinc-850 text-[11px] text-indigo-300 italic font-sans">
                  Quoted: &quot;{cmt.quotedEvidence}&quot;
                </div>
              )}

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {cmt.text}
              </p>

              {cmt.mentions && cmt.mentions.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 pt-1">
                  <span>Mentions:</span>
                  {cmt.mentions.map(m => (
                    <span key={m} className="px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 font-bold">
                      @{m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
