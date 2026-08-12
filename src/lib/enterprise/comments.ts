import { extractMentions } from './mentions';
import { Comment, Role } from './types';
import { logAuditEvent } from './audit';

let commentsStore: Comment[] = [
  {
    id: 'cmt_001',
    targetType: 'INVESTIGATION',
    targetId: 'inv_001_openai_trade_secrets',
    authorId: 'mem_analyst_01',
    authorName: 'Alex Vance',
    authorRole: 'ANALYST',
    text: '@Sarah.Connor Cross-referenced TechCrunch and Ars Technica reports. Primary source court filings confirm security practices defence.',
    quotedEvidence: 'OpenAI says Apple’s own security practices undermine its trade secrets case',
    mentions: ['Sarah.Connor'],
    reactions: { '👍': 2, '🎯': 1 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export function getComments(targetType: 'CLUSTER' | 'INVESTIGATION', targetId: string): Comment[] {
  return commentsStore.filter(c => c.targetType === targetType && c.targetId === targetId);
}

export function addComment(
  targetType: 'CLUSTER' | 'INVESTIGATION',
  targetId: string,
  text: string,
  authorId: string = 'mem_analyst_01',
  authorName: string = 'Alex Vance',
  authorRole: Role = 'ANALYST',
  quotedEvidence?: string
): Comment {
  const mentions = extractMentions(text);

  const comment: Comment = {
    id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    targetType,
    targetId,
    authorId,
    authorName,
    authorRole,
    text,
    quotedEvidence,
    mentions,
    reactions: {},
    createdAt: new Date().toISOString()
  };

  commentsStore.push(comment);
  logAuditEvent(authorId, authorName, authorRole, 'ws_ent_ai', 'POST_COMMENT', comment.id, undefined, text.substring(0, 40));
  return comment;
}
