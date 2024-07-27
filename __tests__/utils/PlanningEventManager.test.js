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

test('generateEventAgenda', () => {
  const eventList = [
    { start: new Date('2020-01-14T09:15:00.000Z') },
    { start: new Date('2020-02-01T09:15:00.000Z') },
    { start: new Date('2020-01-15T09:15:00.000Z') },
    { start: new Date('2020-02-01T09:30:00.000Z') },
    { start: new Date('2020-02-01T08:30:00.000Z') },
  ].map((event) => ({ start: event.start.valueOf() / 1000 })); // convert to timestamp

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
