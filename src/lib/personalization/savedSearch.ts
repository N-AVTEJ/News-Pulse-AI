import { getActiveWorkspace, getUserProfile } from './profile';
import { SavedSearchItem, Workspace } from './types';

export function getSavedSearches(workspace?: Workspace): SavedSearchItem[] {
  const ws = workspace || getActiveWorkspace();
  return ws.savedSearches || [];
}

export function addSavedSearch(
  workspaceId: string,
  name: string,
  query: string,
  category?: string,
  notifications: boolean = true
): SavedSearchItem {
  const profile = getUserProfile();
  const ws = profile.workspaces.find(w => w.id === workspaceId) || getActiveWorkspace();

  const item: SavedSearchItem = {
    id: `ss_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    query,
    category,
    notifications,
    createdAt: new Date().toISOString()
  };

  ws.savedSearches = ws.savedSearches || [];
  ws.savedSearches.unshift(item);
  return item;
}

export function deleteSavedSearch(workspaceId: string, searchId: string): void {
  const profile = getUserProfile();
  const ws = profile.workspaces.find(w => w.id === workspaceId) || getActiveWorkspace();
  if (ws.savedSearches) {
    ws.savedSearches = ws.savedSearches.filter(s => s.id !== searchId);
  }
}
