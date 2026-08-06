import { NextResponse } from 'next/server';
import { notificationEngine } from '@/lib/runtime/notificationEngine';

export async function GET() {
  const notifications = notificationEngine.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return NextResponse.json({
    unreadCount,
    totalCount: notifications.length,
    notifications
  }, { status: 200 });
}
