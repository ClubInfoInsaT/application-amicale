import { getMachineEndDate, getMachineOfId } from '../../src/utils/Proxiwash';

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
