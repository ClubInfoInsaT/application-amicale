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
 * @returns {React.ComponentType<any>}
 */
export const withCollapsible = (Component: React.ComponentType<any>) => {
    return React.forwardRef((props: any, ref: any) => {
        return <Component
            collapsibleStack={useCollapsibleStack()}
            ref={ref}
            {...props}
        />;
    });
};
