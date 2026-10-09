import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import i18n from 'i18n-js';

type Props = {
  date: Date | string | number;
  intervalMs?: number;
};

function toTime(date: Date | string | number): number {
  const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
  return t;
}

function getRelativePart(diffSec: number): string {
  if (diffSec < 60) {
    return i18n.t('screens.proxiwash.updatedJustNow');
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    if (diffMin <= 1) {
      return i18n.t('screens.proxiwash.updatedOneMinute');
    }
    return i18n.t('screens.proxiwash.updatedMinutes', { count: diffMin });
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours <= 1) {
    return i18n.t('screens.proxiwash.updatedOneHour');
  }
  return i18n.t('screens.proxiwash.updatedHours', { count: diffHours });
}

function ProxiwashUpdatedText(props: Props) {
  const { date, intervalMs = 15000 } = props;
  const time = toTime(date);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, time]);

  if (Number.isNaN(time)) {
    return null;
  }
  const diffSec = Math.max(0, Math.floor((Date.now() - time) / 1000));
  return (
    <Text>
      {i18n.t('screens.proxiwash.updated')}
      {getRelativePart(diffSec)}
    </Text>
  );
}

export default ProxiwashUpdatedText;
