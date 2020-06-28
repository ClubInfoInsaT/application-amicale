// @flow

import * as React from 'react';

const speedOffset = 5;

/**
 * Class used to detect when to show or hide a component based on scrolling
 */
export default class AutoHideHandler {

    lastOffset: number;
    isHidden: boolean;

    listeners: Array<Function>;

    constructor(startHidden: boolean) {
        this.listeners = [];
        this.isHidden = startHidden;
    }

    /**
     * Adds a listener to the hide event
     *
     * @param listener
     */
    addListener(listener: Function) {
        this.listeners.push(listener);
    }

    /**
     * Notifies every listener whether they should hide or show.
     *
     * @param shouldHide
     */
    notifyListeners(shouldHide: boolean) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](shouldHide);
        }
    }

    /**
     * Callback to be used on the onScroll animated component event.
     *
     * Detects if the current speed exceeds a threshold and notifies listeners to hide or show.
     *
     * The hide even is triggered when the user scrolls down, and the show event on scroll up.
     * This does not take into account the speed when the y coordinate is negative, to prevent hiding on over scroll.
     * (When scrolling up and hitting the top on ios for example)
     *
     * //TODO Known issue:
     * When refreshing a list with the pull down gesture on ios,
     * this can trigger the hide event as it scrolls down the list to show the refresh indicator.
     * Android shows the refresh indicator on top of the list so this is not an issue.
     *
     * @param nativeEvent The scroll event generated by the animated component onScroll prop
     */
    onScroll({nativeEvent}: Object) {
        const speed = nativeEvent.contentOffset.y < 0 ? 0 : this.lastOffset - nativeEvent.contentOffset.y;
        if (speed < -speedOffset && !this.isHidden) { // Go down
            this.notifyListeners(true);
            this.isHidden = true;
        } else if (speed > speedOffset && this.isHidden) { // Go up
            this.notifyListeners(false);
            this.isHidden = false;
        }
        this.lastOffset = nativeEvent.contentOffset.y;
    }

}
