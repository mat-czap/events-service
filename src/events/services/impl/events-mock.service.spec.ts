import { EventNotFound } from './../events.service';
import { EventsService } from '../events.service';
import { EventsMockService } from './events-mock.service';
import { EventsMockData } from '../../mock-data/event';
import { Event } from '../../models/event';

describe('EventsMockService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    eventsService = new EventsMockService([...EventsMockData]);
  });

  describe('createEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.createEvent).toBeDefined();
      expect(typeof eventsService.createEvent).toBe('function');
    });
  });

  describe('getEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvent).toBeDefined();
      expect(typeof eventsService.getEvent).toBe('function');
    });

    it(`should return event when the event's id exists`, async () => {
      const expected: Event = {
        id: '25ac2e05-b1e8-47b4-b46c-c0bd7004bfa9',
        title: 'Exceptional Group',
        startDate: '2020-01-01T09:00:00.000Z',
        endDate: '2020-01-01T11:00:00.000Z',
      };

      const result: Event = await eventsService.getEvent(expected.id);

      expect(result).toMatchObject(expected);
    });

    it(`should throw Error when event's id not found`, async () => {
      const nonExistingId = '25ac2e05-b1e8-47b4-b46c-to-nie-moze-dzialac';

      expect.assertions(2);

      try {
        await eventsService.getEvent(nonExistingId);
      } catch (error) {
        expect(error).toBeInstanceOf(EventNotFound);

        expect(error).toHaveProperty('message', 'Event has been not found');
      }
    });
  });

  describe('getEvents()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvents).toBeDefined();
      expect(typeof eventsService.getEvents).toBe('function');
    });
  });

  describe('removeEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.removeEvent).toBeDefined();
      expect(typeof eventsService.removeEvent).toBe('function');
    });

    it('should remove project if id exists', async () => {
      const id = '25ac2e05-b1e8-47b4-b46c-c0bd7004bfa9';

      expect(await eventsService.removeEvent(id)).toBe(undefined);
    });

    it(`should throw Error when event's id not found`, async () => {
      const nonExistingId = '25ac2e05-b1e8-47b4-b46c-to-nie-moze-dzialac';

      expect.assertions(2);

      try {
        await eventsService.getEvent(nonExistingId);
      } catch (error) {
        expect(error).toBeInstanceOf(EventNotFound);

        expect(error).toHaveProperty('message', 'Event has been not found');
      }
    });
  });
});
