import * as Planning from '../../src/utils/Planning';

test('isDescriptionEmpty', () => {
  expect(Planning.isDescriptionEmpty('')).toBeTrue();
  expect(Planning.isDescriptionEmpty('   ')).toBeTrue();
  // noinspection CheckTagEmptyBody
  expect(Planning.isDescriptionEmpty('<p></p>')).toBeTrue();
  expect(Planning.isDescriptionEmpty('<p>   </p>')).toBeTrue();
  expect(Planning.isDescriptionEmpty('<p><br></p>')).toBeTrue();
  expect(Planning.isDescriptionEmpty('<p><br></p><p><br></p>')).toBeTrue();
  expect(Planning.isDescriptionEmpty('<p><br><br><br></p>')).toBeTrue();
  expect(Planning.isDescriptionEmpty('<p><br>')).toBeTrue();
  expect(Planning.isDescriptionEmpty(null)).toBeTrue();
  expect(Planning.isDescriptionEmpty(undefined)).toBeTrue();
  expect(Planning.isDescriptionEmpty('coucou')).toBeFalse();
  expect(Planning.isDescriptionEmpty('<p>coucou</p>')).toBeFalse();
});

test('dateToDateTimeString', () => {
  let testDate = new Date();
  testDate.setFullYear(2020, 2, 21);
  testDate.setHours(9, 0, 0, 0);
  expect(Planning.dateToDateTimeString(testDate)).toBe('2020-03-21 09:00');
  testDate.setFullYear(2021, 0, 12);
  testDate.setHours(9, 10, 0, 0);
  expect(Planning.dateToDateTimeString(testDate)).toBe('2021-01-12 09:10');
  testDate.setFullYear(2022, 11, 31);
  testDate.setHours(9, 10, 15, 0);
  expect(Planning.dateToDateTimeString(testDate)).toBe('2022-12-31 09:10');
});

test('generateEventAgenda empty agenda', () => {
  const eventList = [];

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList);
  expect(Object.keys(calendar).length).toBe(1);
  expect(calendar['2020-01-14'].length).toBe(0);
});

test('generateEventAgenda one event today', () => {
  const eventList = [
    {
      start: new Date('2020-01-14T09:15:00.000Z'),
      end: new Date('2020-01-14T10:15:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(Object.keys(calendar).length).toBe(1);
  expect(calendar['2020-01-14'].length).toBe(1);
  expect(calendar['2020-01-14'][0]).toBe(eventList[0]);
});

test('generateEventAgenda two events today', () => {
  const eventList = [
    {
      start: new Date('2020-01-14T11:15:00.000Z'),
      end: new Date('2020-01-14T12:15:00.000Z'),
    },
    {
      start: new Date('2020-01-14T09:15:00.000Z'),
      end: new Date('2020-01-14T10:15:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(Object.keys(calendar).length).toBe(1);
  expect(calendar['2020-01-14'].length).toBe(2);
  expect(calendar['2020-01-14'][0]).toBe(eventList[1]);
  expect(calendar['2020-01-14'][1]).toBe(eventList[0]);
});

test('generateEventAgenda two events tomorrow', () => {
  const eventList = [
    {
      start: new Date('2020-01-15T00:00:00.000Z'),
      end: new Date('2020-01-15T12:15:00.000Z'),
    },
    {
      start: new Date('2020-01-15T09:15:00.000Z'),
      end: new Date('2020-01-15T10:15:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(Object.keys(calendar).length).toBe(2);
  expect(calendar['2020-01-14'].length).toBe(0);
  expect(calendar['2020-01-15'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-15'][1]).toBe(eventList[1]);
});

test('generateEventAgenda future event spanning 3 days', () => {
  const eventList = [
    {
      // length: 2 days
      start: new Date('2020-01-16T00:00:00.000Z'),
      end: new Date('2020-01-18T12:15:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(Object.keys(calendar).length).toBe(4);
  expect(calendar['2020-01-14'].length).toBe(0);
  expect(calendar['2020-01-16'].length).toBe(1);
  expect(calendar['2020-01-16'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-17'].length).toBe(1);
  expect(calendar['2020-01-17'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-18'].length).toBe(1);
  expect(calendar['2020-01-18'][0]).toBe(eventList[0]);
});

test('generateEventAgenda current event spanning 3 days', () => {
  const eventList = [
    {
      // length: 2 days
      start: new Date('2020-01-13T00:00:00.000Z'),
      end: new Date('2020-01-15T12:15:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(Object.keys(calendar).length).toBe(3);
  expect(calendar['2020-01-13'].length).toBe(1);
  expect(calendar['2020-01-13'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-14'].length).toBe(1);
  expect(calendar['2020-01-14'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-15'].length).toBe(1);
  expect(calendar['2020-01-15'][0]).toBe(eventList[0]);
});

test('generateEventAgenda', () => {
  const eventList = [
    {
      start: new Date('2020-01-14T09:15:00.000Z'),
      end: new Date('2020-01-14T10:15:00.000Z'),
    },
    {
      start: new Date('2020-02-01T09:15:00.000Z'),
      end: new Date('2020-02-01T10:15:00.000Z'),
    },
    {
      start: new Date('2020-01-15T09:15:00.000Z'),
      end: new Date('2020-01-15T10:15:00.000Z'),
    },
    {
      start: new Date('2020-02-01T09:30:00.000Z'),
      end: new Date('2020-02-01T10:30:00.000Z'),
    },
    {
      start: new Date('2020-02-01T08:30:00.000Z'),
      end: new Date('2020-02-01T09:30:00.000Z'),
    },
  ].map((event) => ({
    start: event.start.valueOf() / 1000,
    end: event.end.valueOf() / 1000,
  })); // convert to timestamp

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T00:00:00.000Z').getTime());

  const calendar = Planning.generateEventAgenda(eventList, 2);
  expect(calendar['2020-01-14'].length).toBe(1);
  expect(calendar['2020-01-14'][0]).toBe(eventList[0]);
  expect(calendar['2020-01-15'].length).toBe(1);
  expect(calendar['2020-01-15'][0]).toBe(eventList[2]);
  expect(calendar['2020-02-01'].length).toBe(3);
  expect(calendar['2020-02-01'][0]).toBe(eventList[4]);
  expect(calendar['2020-02-01'][1]).toBe(eventList[1]);
  expect(calendar['2020-02-01'][2]).toBe(eventList[3]);
});

test('getSubtitle same day, with date, no location', () => {
  const event = {
    start: new Date('2020-01-14T09:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-14T10:15:00.000Z').valueOf() / 1000,
    description: 'coucou',
  };
  expect(Planning.getSubtitle(event)).toBe('14/01/2020 09:15-10:15');
});

test('getSubtitle same day, with date, with location', () => {
  const event = {
    start: new Date('2020-01-14T09:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-14T10:15:00.000Z').valueOf() / 1000,
    description: 'coucou',
    location: 'RU INSA',
  };
  expect(Planning.getSubtitle(event)).toBe('14/01/2020 09:15-10:15 @ RU INSA');
});

test('getSubtitle same day, no date, no location', () => {
  const event = {
    start: new Date('2020-01-14T09:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-14T10:15:00.000Z').valueOf() / 1000,
    description: 'coucou',
  };
  expect(Planning.getSubtitle(event, false)).toBe('09:15-10:15');
});

test('getSubtitle same day, no date, with location', () => {
  const event = {
    start: new Date('2020-01-14T09:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-14T10:15:00.000Z').valueOf() / 1000,
    description: 'coucou',
    location: 'RU INSA',
  };
  expect(Planning.getSubtitle(event, false)).toBe('09:15-10:15 @ RU INSA');
});

test('getSubtitle next day, less than 12h, no date, no location', () => {
  const event = {
    start: new Date('2020-01-14T21:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-15T09:05:00.000Z').valueOf() / 1000,
    description: 'coucou',
  };
  expect(Planning.getSubtitle(event, false)).toBe('21:15-09:05');
});

test('getSubtitle next day, more than 12h, no date, no location', () => {
  const event = {
    start: new Date('2020-01-14T21:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-15T09:25:00.000Z').valueOf() / 1000,
    description: 'coucou',
  };
  expect(Planning.getSubtitle(event, false)).toBe('21:15-15/01/2020 09:25');
});

test('getSubtitle different day, with date, with location', () => {
  const event = {
    start: new Date('2020-01-14T21:15:00.000Z').valueOf() / 1000,
    end: new Date('2020-01-17T09:05:00.000Z').valueOf() / 1000,
    description: 'coucou',
    location: 'RU INSA',
  };
  expect(Planning.getSubtitle(event, true)).toBe(
    '14/01/2020 21:15-17/01/2020 09:05 @ RU INSA'
  );
});
