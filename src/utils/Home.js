// @flow

import {stringToDate} from './Planning';
import type {EventType} from '../screens/Home/HomeScreen';

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
 * Gets the duration (in milliseconds) of an event
 *
 * @param event {EventType}
 * @return {number} The number of milliseconds
 */
export function getEventDuration(event: EventType): number {
  const start = stringToDate(event.date_begin);
  const end = stringToDate(event.date_end);
  let duration = 0;
  if (start != null && end != null) duration = end - start;
  return duration;
}

/**
 * Gets events starting after the limit
 *
 * @param events
 * @param limit
 * @return {Array<Object>}
 */
export function getEventsAfterLimit(
  events: Array<EventType>,
  limit: Date,
): Array<EventType> {
  const validEvents = [];
  events.forEach((event: EventType) => {
    const startDate = stringToDate(event.date_begin);
    if (startDate != null && startDate >= limit) {
      validEvents.push(event);
    }
  });
  return validEvents;
}

/**
 * Gets the event with the longest duration in the given array.
 * If all events have the same duration, return the first in the array.
 *
 * @param events
 */
export function getLongestEvent(events: Array<EventType>): EventType {
  let longestEvent = events[0];
  let longestTime = 0;
  events.forEach((event: EventType) => {
    const time = getEventDuration(event);
    if (time > longestTime) {
      longestTime = time;
      longestEvent = event;
    }
  });
  return longestEvent;
}

/**
 * Gets events that have not yet ended/started
 *
 * @param events
 */
export function getFutureEvents(events: Array<EventType>): Array<EventType> {
  const validEvents = [];
  const now = new Date();
  events.forEach((event: EventType) => {
    const startDate = stringToDate(event.date_begin);
    const endDate = stringToDate(event.date_end);
    if (startDate != null) {
      if (startDate > now) validEvents.push(event);
      else if (endDate != null) {
        if (endDate > now || endDate < startDate)
          // Display event if it ends the following day
          validEvents.push(event);
      }
    }
  });
  return validEvents;
}

/**
 * Gets the event to display in the preview
 *
 * @param events
 * @return {EventType | null}
 */
export function getDisplayEvent(events: Array<EventType>): EventType | null {
  let displayEvent = null;
  if (events.length > 1) {
    const eventsAfterLimit = getEventsAfterLimit(
      events,
      getTodayEventTimeLimit(),
    );
    if (eventsAfterLimit.length > 0) {
      if (eventsAfterLimit.length === 1) [displayEvent] = eventsAfterLimit;
      else displayEvent = getLongestEvent(events);
    } else {
      displayEvent = getLongestEvent(events);
    }
  } else if (events.length === 1) {
    [displayEvent] = events;
  }
  return displayEvent;
}
