import { ClusterChangeDelta } from './changeDetector';
import { NotificationItem, UserNotificationPreferences } from './types';

const defaultPreferences: UserNotificationPreferences = {
  aiTech: true,
  business: true,
  world: true,
  breakingOnly: false,
  officialAnnouncementsOnly: false
};

class InternalNotificationEngine {
  private notifications: NotificationItem[] = [];
  private sentClusterNotificationKeys = new Set<string>();

  generateNotificationsFromDelta(
    delta: ClusterChangeDelta,
    prefs: UserNotificationPreferences = defaultPreferences
  ): NotificationItem[] {
    const newNotifications: NotificationItem[] = [];

    // 1. New Breaking Events
    for (const cluster of delta.newEvents) {
      if (cluster.breakingState === 'BREAKING') {
        const key = `notif_breaking_${cluster.clusterId}`;
        if (!this.sentClusterNotificationKeys.has(key)) {
          this.sentClusterNotificationKeys.add(key);

          newNotifications.push({
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'BREAKING_EVENT',
            title: `BREAKING: ${cluster.canonicalHeadline}`,
            message: `Reported by ${cluster.publisherCount} publishers (${cluster.publishers.join(', ')}).`,
            clusterId: cluster.clusterId,
            timestamp: new Date().toISOString(),
            read: false,
            category: cluster.primaryCategory
          });
        }
      }
    }

    // 2. Verification Upgrades
    for (const upg of delta.verificationUpgrades) {
      const key = `notif_upg_${upg.cluster.clusterId}_${upg.newStatus}`;
      if (!this.sentClusterNotificationKeys.has(key)) {
        this.sentClusterNotificationKeys.add(key);

        newNotifications.push({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'VERIFICATION_UPGRADE',
          title: `Verification Upgraded: ${upg.cluster.canonicalHeadline}`,
          message: `Corroboration status upgraded to ${upg.newStatus} across ${upg.cluster.publisherCount} independent outlets.`,
          clusterId: upg.cluster.clusterId,
          timestamp: new Date().toISOString(),
          read: false,
          category: upg.cluster.primaryCategory
        });
      }
    }

    // 3. New Primary Source Statements
    for (const stmt of delta.newPrimaryStatements) {
      const key = `notif_stmt_${stmt.cluster.clusterId}_${stmt.primarySource}`;
      if (!this.sentClusterNotificationKeys.has(key)) {
        this.sentClusterNotificationKeys.add(key);

        newNotifications.push({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'PRIMARY_STATEMENT_ADDED',
          title: `Official Announcement: ${stmt.primarySource}`,
          message: `Official primary source statement added to cluster "${stmt.cluster.canonicalHeadline}".`,
          clusterId: stmt.cluster.clusterId,
          timestamp: new Date().toISOString(),
          read: false,
          category: stmt.cluster.primaryCategory
        });
      }
    }

    // Apply Preference Filters
    const filtered = newNotifications.filter((n) => {
      if (prefs.breakingOnly && n.type !== 'BREAKING_EVENT') return false;
      if (prefs.officialAnnouncementsOnly && n.type !== 'PRIMARY_STATEMENT_ADDED') return false;
      if (n.category === 'ai-tech' && !prefs.aiTech) return false;
      if (n.category === 'business' && !prefs.business) return false;
      if (n.category === 'world' && !prefs.world) return false;
      return true;
    });

    this.notifications.unshift(...filtered);
    return filtered;
  }

  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  clearNotifications(): void {
    this.notifications = [];
    this.sentClusterNotificationKeys.clear();
  }
}

export const notificationEngine = new InternalNotificationEngine();
