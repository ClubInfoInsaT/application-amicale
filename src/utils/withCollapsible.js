import React from 'react';
import {useCollapsibleStack} from "react-navigation-collapsible";

/**
 * Function used to manipulate Collapsible Hooks from a class.
 *
 * Usage :
 *
 * export withCollapsible(Component)
 *
 * replacing Component with the one you want to use.
 * This component will then receive the collapsibleStack prop.
 *
 * @param Component The component to use Collapsible with
 * @returns {React.ComponentType<React.ClassAttributes<unknown>>}
 */
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
