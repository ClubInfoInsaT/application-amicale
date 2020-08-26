// @flow

import {stringToDate} from './Planning';
import type {PlanningEventType} from './Planning';

/**
 * Gets the time limit depending on the current day:
 * 17:30 for every day of the week except for thursday 11:30
 * 00:00 on weekends
 */
export function getTodayEventTimeLimit(): Date {
  const now = new Date();
  if (now.getDay() === 4)
    // Thursday
    now.setHours(11, 30, 0);
  else if (now.getDay() === 6 || now.getDay() === 0)
    // Weekend
    now.setHours(0, 0, 0);
  else now.setHours(17, 30, 0);
  return now;
}

/**
 * Gets events starting after the limit
 *
 * @param events
 * @param limit
 * @return {Array<Object>}
 */
export function getEventsAfterLimit(
  events: Array<PlanningEventType>,
  limit: Date,
): Array<PlanningEventType> {
  const validEvents = [];
  events.forEach((event: PlanningEventType) => {
    const startDate = stringToDate(event.date_begin);
    if (startDate != null && startDate >= limit) {
      validEvents.push(event);
    }
  });
  return validEvents;
}

/**
 * Gets events that have not yet ended/started
 *
 * @param events
 */
export function getFutureEvents(
  events: Array<PlanningEventType>,
): Array<PlanningEventType> {
  const validEvents = [];
  const now = new Date();
  events.forEach((event: PlanningEventType) => {
    const startDate = stringToDate(event.date_begin);
    if (startDate != null && startDate > now) validEvents.push(event);
  });
  return validEvents;
}

/**
 * Gets the event to display in the preview
 *
 * @param events
 * @return {PlanningEventType | null}
 */
export function getDisplayEvent(
  events: Array<PlanningEventType>,
): PlanningEventType | null {
  let displayEvent = null;
  if (events.length > 1) {
    const eventsAfterLimit = getEventsAfterLimit(
      events,
      getTodayEventTimeLimit(),
    );
    if (eventsAfterLimit.length > 0) [displayEvent] = eventsAfterLimit;
    else [displayEvent] = events;
  } else if (events.length === 1) [displayEvent] = events;
  return displayEvent;
}
