import { EventNotFound, ConflictError } from './../events.service';
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

    it('should create and return event', async () => {
      const dateFrom = '2020-01-01T06:00:00.000Z';
      const dateTo = '2020-01-01T08:00:00.000Z';
      const title = 'Superb Celebration';

      const expected = {
        startDate: dateFrom,
        endDate: dateTo,
        title,
      };

      const result: Event = await eventsService.createEvent(dateFrom, dateTo, title);
      expect(result).toEqual(expect.objectContaining(expected));
    });

    it('should throw error because of collision with different event', async () => {
      const dateFrom = '2020-01-01T09:00:00.000Z';
      const dateTo = '2020-01-01T11:00:00.000Z';
      const title = 'Superb Celebration';

      expect.assertions(2);

      try {
        await eventsService.createEvent(dateFrom, dateTo, title);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);

        expect(error).toHaveProperty(
          'message',
          'Event is not possible to be established because of collision with another',
        );
      }
    });

    it('should create event even if start time is exactly the same as endtime of different event', async () => {
      const dateFrom = '2020-01-01T11:00:00.000Z';
      const dateTo = '2020-01-01T11:59:00.000Z';
      const title = 'Superb Celebration';

      const expected = {
        startDate: dateFrom,
        endDate: dateTo,
        title,
      };

      const result: Event = await eventsService.createEvent(dateFrom, dateTo, title);
      expect(result).toEqual(expect.objectContaining(expected));
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

    it('should return first 3 events', async () => {
      const numberEvents = 3;
      const sample = [
        {
          id: '25ac2e05-b1e8-47b4-b46c-c0bd7004bfa9',
          title: 'Exceptional Group',
          startDate: '2020-01-01T09:00:00.000Z',
          endDate: '2020-01-01T11:00:00.000Z',
        },
        {
          id: 'd32aa30d-337b-49c8-bb98-d5f3e2388170',
          title: 'Shindig Red Inc',
          startDate: '2020-01-01T12:00:00.000Z',
          endDate: '2020-01-01T14:00:00.000Z',
        },
        {
          id: 'fd198a9e-f24a-4f92-9716-ecefeac71bd1',
          title: 'Vox Scene Bliss',
          startDate: '2020-01-01T15:00:00.000Z',
          endDate: '2020-01-01T17:00:00.000Z',
        },
      ];

      const startDate = '2020-01-01T09:00:00.000Z';
      const endData = '2020-01-01T15:00:00.000Z';

      const result = await eventsService.getEvents(startDate, endData, 0, 0);
      expect(result.totalCount).toBe(numberEvents);
      expect(result.events).toEqual(sample);
    });

    it('should return events numbers 2 and 3 (instead of 1-3) because of offset 1', async () => {
      const expectedEventsNum = 2;
      const expectedEvents = [
        {
          id: 'd32aa30d-337b-49c8-bb98-d5f3e2388170',
          title: 'Shindig Red Inc',
          startDate: '2020-01-01T12:00:00.000Z',
          endDate: '2020-01-01T14:00:00.000Z',
        },
        {
          id: 'fd198a9e-f24a-4f92-9716-ecefeac71bd1',
          title: 'Vox Scene Bliss',
          startDate: '2020-01-01T15:00:00.000Z',
          endDate: '2020-01-01T17:00:00.000Z',
        },
      ];

      const exprectedResult = { totalCount: expectedEventsNum, events: expectedEvents };

      const startDate = '2020-01-01T09:00:00.000Z';
      const endData = '2020-01-01T15:00:00.000Z';

      const result = await eventsService.getEvents(startDate, endData, 1, 0);
      expect(result).toMatchObject(exprectedResult);
    });

    it('should return events numbers 2 (instead of 1-3) because of offset 1 and limit 1 ', async () => {
      const expectedEventsNum = 1;
      const expectedEvents = [
        {
          id: 'd32aa30d-337b-49c8-bb98-d5f3e2388170',
          title: 'Shindig Red Inc',
          startDate: '2020-01-01T12:00:00.000Z',
          endDate: '2020-01-01T14:00:00.000Z',
        },
      ];

      const exprectedResult = { totalCount: expectedEventsNum, events: expectedEvents };

      const startDate = '2020-01-01T09:00:00.000Z';
      const endData = '2020-01-01T15:00:00.000Z';

      const result = await eventsService.getEvents(startDate, endData, 1, 1);
      expect(result).toMatchObject(exprectedResult);
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
