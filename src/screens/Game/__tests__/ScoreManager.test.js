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
