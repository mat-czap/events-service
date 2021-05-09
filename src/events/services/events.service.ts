import { Event } from '../models/event';

export interface EventsService {
  /**
   * Gets event from the mock-data source by the identifier
   */
  getEvent(id: string): Promise<Event>;

  /**
   * Gets events from given period including pagination by offset and limit
   */
  getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number,
  ): Promise<{ totalCount: number; events: Event[] }>;

  /**
   * Creates event for given period
   */
  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event>;

  /**
   * Removes event from the mock-data source by the identifier
   */
  removeEvent(id: string): Promise<void>;
}

export class EventNotFound extends Error {
  constructor(message = 'Event has been not found') {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    message = `Event is not possible to be established because of collision with EVENT_ID: ${message}`;
    super(message);
  }
}
