// @flow

import * as React from 'react';

const speedOffset = 5;

export default class AutoHideHandler {

    lastOffset: number;
    isHidden: boolean;

    listeners: Array<Function>;

    constructor(startHidden: boolean) {
        this.listeners = [];
        this.isHidden = startHidden;
    }

    addListener(listener: Function) {
        this.listeners.push(listener);
    }

    notifyListeners(shouldHide: boolean) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](shouldHide);
        }
    }

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