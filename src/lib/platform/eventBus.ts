export type EventTopic =
  | 'EventClusterCreated'
  | 'VerificationCompleted'
  | 'AnalysisGenerated'
  | 'InvestigationUpdated'
  | 'TaskAssigned'
  | 'NotificationSent';

export interface PlatformEventPayload {
  id: string;
  topic: EventTopic;
  timestamp: string;
  payload: Record<string, unknown>;
}

type EventCallback = (event: PlatformEventPayload) => void;

class InternalEventBus {
  private subscribers: Map<EventTopic, EventCallback[]> = new Map();
  private eventLog: PlatformEventPayload[] = [];

  subscribe(topic: EventTopic, callback: EventCallback): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(topic) || [];
      this.subscribers.set(topic, callbacks.filter(cb => cb !== callback));
    };
  }

  publish(topic: EventTopic, data: Record<string, unknown>): PlatformEventPayload {
    const event: PlatformEventPayload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topic,
      timestamp: new Date().toISOString(),
      payload: data
    };

    this.eventLog.unshift(event);
    if (this.eventLog.length > 100) this.eventLog.pop();

    const callbacks = this.subscribers.get(topic) || [];
    for (const cb of callbacks) {
      try {
        cb(event);
      } catch (err) {
        console.error(`[EventBus] Error in subscriber for topic '${topic}':`, err);
      }
    }

    return event;
  }

  getEventLog(): PlatformEventPayload[] {
    return this.eventLog;
  }

  clearLog(): void {
    this.eventLog = [];
  }
}

export const eventBus = new InternalEventBus();
