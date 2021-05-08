import { EventNotFound } from './../events.service';
import { EventsService } from '../events.service';
import { Event } from '../../models/event';

type getEventsResult = { totalCount: number; events: Event[] };

/* eslint-disable */
export class EventsMockService implements EventsService {
  constructor(private _events: Event[]) {}

  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }

  getEvent(id: string): Promise<Event> {
    const event: Event = this._events.find((event) => event.id === id);

    if (!event) throw new EventNotFound();

    return Promise.resolve(event);
  }

  getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number,
  ): Promise<{ totalCount: number; events: Event[] }> {
    const [start, end] = [dateFrom, dateTo].map((date) => new Date(date));

    const isBetweenDates = (event: Event) => new Date(event.startDate) >= start && new Date(event.startDate) <= end;

    const makeResult = (total: getEventsResult, event: Event) => {
      total.totalCount++;
      total.events.push(event);
      return total;
    };

    const initialVal: getEventsResult = { totalCount: 0, events: [] };

    const result: getEventsResult = this._events
      .filter((event) => isBetweenDates(event))
      .slice(offset || 0)
      .slice(0, limit || undefined)
      .reduce(makeResult, initialVal);

    return Promise.resolve(result);
  }

  removeEvent(id: string): Promise<void> {
    const index = this._events.findIndex((i) => i.id === id);
    if (index > -1) {
      this._events.splice(index, 1);
    } else {
      throw new EventNotFound();
    }

    return Promise.resolve();
  }
}
