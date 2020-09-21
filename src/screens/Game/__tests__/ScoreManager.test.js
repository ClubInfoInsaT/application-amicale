/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable */

import React from 'react';
import ScoreManager from '../logic/ScoreManager';

test('incrementScore', () => {
  let scoreManager = new ScoreManager();
  expect(scoreManager.getScore()).toBe(0);
  scoreManager.incrementScore();
  expect(scoreManager.getScore()).toBe(1);
});

test('addLinesRemovedPoints', () => {
  let scoreManager = new ScoreManager();
  scoreManager.addLinesRemovedPoints(0);
  scoreManager.addLinesRemovedPoints(5);
  expect(scoreManager.getScore()).toBe(0);
  expect(scoreManager.getLevelProgression()).toBe(0);

  scoreManager.addLinesRemovedPoints(1);
  expect(scoreManager.getScore()).toBe(40);
  expect(scoreManager.getLevelProgression()).toBe(1);

  scoreManager.addLinesRemovedPoints(2);
  expect(scoreManager.getScore()).toBe(140);
  expect(scoreManager.getLevelProgression()).toBe(4);

  scoreManager.addLinesRemovedPoints(3);
  expect(scoreManager.getScore()).toBe(440);
  expect(scoreManager.getLevelProgression()).toBe(9);

  scoreManager.addLinesRemovedPoints(4);
  expect(scoreManager.getScore()).toBe(1640);
  expect(scoreManager.getLevelProgression()).toBe(17);
});

test('canLevelUp', () => {
  let scoreManager = new ScoreManager();
  expect(scoreManager.canLevelUp()).toBeFalse();
  expect(scoreManager.getLevel()).toBe(0);
  expect(scoreManager.getLevelProgression()).toBe(0);

  scoreManager.addLinesRemovedPoints(1);
  expect(scoreManager.canLevelUp()).toBeTrue();
  expect(scoreManager.getLevel()).toBe(1);
  expect(scoreManager.getLevelProgression()).toBe(1);

  scoreManager.addLinesRemovedPoints(1);
  expect(scoreManager.canLevelUp()).toBeFalse();
  expect(scoreManager.getLevel()).toBe(1);
  expect(scoreManager.getLevelProgression()).toBe(2);

  scoreManager.addLinesRemovedPoints(2);
  expect(scoreManager.canLevelUp()).toBeFalse();
  expect(scoreManager.getLevel()).toBe(1);
  expect(scoreManager.getLevelProgression()).toBe(5);

  scoreManager.addLinesRemovedPoints(1);
  expect(scoreManager.canLevelUp()).toBeTrue();
  expect(scoreManager.getLevel()).toBe(2);
  expect(scoreManager.getLevelProgression()).toBe(1);

  scoreManager.addLinesRemovedPoints(4);
  expect(scoreManager.canLevelUp()).toBeFalse();
  expect(scoreManager.getLevel()).toBe(2);
  expect(scoreManager.getLevelProgression()).toBe(9);

  scoreManager.addLinesRemovedPoints(2);
  expect(scoreManager.canLevelUp()).toBeTrue();
  expect(scoreManager.getLevel()).toBe(3);
  expect(scoreManager.getLevelProgression()).toBe(2);
});
