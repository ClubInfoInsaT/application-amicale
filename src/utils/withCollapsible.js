import React from 'react';
import {StatusBar} from 'react-native';
import {useCollapsibleStack} from "react-navigation-collapsible";

export const withCollapsible = (Component: any) => {
    return React.forwardRef((props: any, ref: any) => {

        const {
            onScroll,
            onScrollWithListener,
            containerPaddingTop,
            scrollIndicatorInsetTop,
            translateY,
            progress,
            opacity,
        } = useCollapsibleStack();
        const statusbarHeight = StatusBar.currentHeight != null ? StatusBar.currentHeight : 0;
        return <Component
            collapsibleStack={{
                onScroll,
                onScrollWithListener,
                containerPaddingTop: containerPaddingTop,
                scrollIndicatorInsetTop: scrollIndicatorInsetTop,
                translateY,
                progress,
                opacity,
            }}
            ref={ref}
            {...props}
        />;
    });
};
