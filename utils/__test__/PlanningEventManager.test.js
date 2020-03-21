import React from 'react';
import PlanningEventManager from "../PlanningEventManager";

test('isDescriptionEmpty', () => {
    expect(PlanningEventManager.isDescriptionEmpty("")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("   ")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p>   </p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br></p><p><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br><br><br></p>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("<p><br>")).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty(null)).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty(undefined)).toBeTrue();
    expect(PlanningEventManager.isDescriptionEmpty("coucou")).toBeFalse();
    expect(PlanningEventManager.isDescriptionEmpty("<p>coucou</p>")).toBeFalse();
});


