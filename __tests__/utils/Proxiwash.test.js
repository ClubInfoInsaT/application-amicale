import {
  getCleanedMachineWatched,
  getMachineEndDate,
  getMachineOfId,
  isMachineWatched,
} from '../../src/utils/Proxiwash';

test('getMachineEndDate', () => {
  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T15:00:00.000Z').getTime());
  let expectDate = new Date('2020-01-14T15:00:00.000Z');
  expectDate.setHours(23);
  expectDate.setMinutes(10);
  expect(getMachineEndDate({ endTime: '23:10' }).getTime()).toBe(
    expectDate.getTime()
  );

  expectDate.setHours(16);
  expectDate.setMinutes(30);
  expect(getMachineEndDate({ endTime: '16:30' }).getTime()).toBe(
    expectDate.getTime()
  );

  expect(getMachineEndDate({ endTime: '15:30' })).toBeNull();

  expect(getMachineEndDate({ endTime: '13:10' })).toBeNull();

  jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2020-01-14T23:00:00.000Z').getTime());
  expectDate = new Date('2020-01-14T23:00:00.000Z');
  expectDate.setHours(0);
  expectDate.setMinutes(30);
  expect(getMachineEndDate({ endTime: '00:30' }).getTime()).toBe(
    expectDate.getTime()
  );
});

test('isMachineWatched', () => {
  let machineList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:30',
    },
  ];
  expect(
    isMachineWatched({ number: '0', endTime: '23:30' }, machineList)
  ).toBeTrue();
  expect(
    isMachineWatched({ number: '1', endTime: '20:30' }, machineList)
  ).toBeTrue();
  expect(
    isMachineWatched({ number: '3', endTime: '20:30' }, machineList)
  ).toBeFalse();
  expect(
    isMachineWatched({ number: '1', endTime: '23:30' }, machineList)
  ).toBeFalse();
});

test('getMachineOfId', () => {
  let machineList = [
    {
      number: '0',
    },
    {
      number: '1',
    },
  ];
  expect(getMachineOfId('0', machineList)).toStrictEqual({ number: '0' });
  expect(getMachineOfId('1', machineList)).toStrictEqual({ number: '1' });
  expect(getMachineOfId('3', machineList)).toBeNull();
});

test('getCleanedMachineWatched', () => {
  let machineList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:30',
    },
    {
      number: '2',
      endTime: '',
    },
  ];
  let watchList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:30',
    },
    {
      number: '2',
      endTime: '',
    },
  ];
  let cleanedList = watchList;
  expect(getCleanedMachineWatched(watchList, machineList)).toStrictEqual(
    cleanedList
  );

  watchList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:30',
    },
    {
      number: '2',
      endTime: '15:30',
    },
  ];
  cleanedList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:30',
    },
  ];
  expect(getCleanedMachineWatched(watchList, machineList)).toStrictEqual(
    cleanedList
  );

  watchList = [
    {
      number: '0',
      endTime: '23:30',
    },
    {
      number: '1',
      endTime: '20:31',
    },
    {
      number: '3',
      endTime: '15:30',
    },
  ];
  cleanedList = [
    {
      number: '0',
      endTime: '23:30',
    },
  ];
  expect(getCleanedMachineWatched(watchList, machineList)).toStrictEqual(
    cleanedList
  );
});
