// @flow

import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';

export function openBrowser(url: string, color: string) {
    WebBrowser.openBrowserAsync(url, {
        toolbarColor: color,
        enableBarCollapsing: true,
    });
}
