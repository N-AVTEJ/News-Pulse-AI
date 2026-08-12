export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ANALYST' | 'RESEARCHER' | 'VIEWER' | 'GUEST';

export type Permission =
  | 'VIEW_EVENTS'
  | 'EDIT_INVESTIGATIONS'
  | 'ASSIGN_TASKS'
  | 'MANAGE_MEMBERS'
  | 'MANAGE_WATCHLISTS'
  | 'EXPORT_REPORTS'
  | 'DELETE_COMMENTS'
  | 'MANAGE_ORGANIZATION'
  | 'INVITE_MEMBERS'
  | 'CONFIGURE_ALERTS';

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  team: string;
  joinedAt: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  departments: string[];
  teams: string[];
  members: OrgMember[];
  logoUrl?: string;
}

export interface SharedWorkspace {
  id: string;
  name: string;
  description: string;
  members: string[]; // Member IDs
  createdAt: string;
}

export type InvestigationStatus = 'DRAFT' | 'OPEN' | 'ACTIVE' | 'AWAITING_REVIEW' | 'COMPLETED' | 'ARCHIVED';
export type InvestigationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  priority: InvestigationPriority;
  createdBy: string; // Member ID
  assignedTo: string[]; // Member IDs
  clusterIds: string[];
  evidenceCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CollaborativeTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  linkedInvestigationId?: string;
  linkedClusterId?: string;
  checklist: { id: string; text: string; done: boolean }[];
  createdAt: string;
}

export interface Comment {
  id: string;
  targetType: 'CLUSTER' | 'INVESTIGATION';
  targetId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  text: string;
  quotedEvidence?: string;
  mentions: string[]; // @usernames
  reactions: Record<string, number>;
  createdAt: string;
}

export interface AnnotationItem {
  id: string;
  targetId: string; // Report or Cluster ID
  authorName: string;
  selectedText: string;
  note: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  workspaceId: string;
  action: string;
  targetResource: string;
  previousValue?: string;
  newValue?: string;
}

export interface TeamActivityItem {
  id: string;
  type: 'INVESTIGATION_CREATED' | 'TASK_ASSIGNED' | 'COMMENT_ADDED' | 'EVIDENCE_ATTACHED' | 'VERIFICATION_UPDATED' | 'MEMBER_JOINED';
  title: string;
  actorName: string;
  timestamp: string;
}
