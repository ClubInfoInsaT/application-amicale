import React from 'react';
import PlanningEventManager from "../PlanningEventManager";

test('time test', () => {
    expect(PlanningEventManager.formatTime("1:2")).toBe("1:2");
});

test('time test 2', () => {
    expect(PlanningEventManager.formatTime("1:2")).toBe("2:2");
});
