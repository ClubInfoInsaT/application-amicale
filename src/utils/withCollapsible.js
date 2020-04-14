import React from 'react';
import {useCollapsibleStack} from "react-navigation-collapsible";

export const withCollapsible = (Component: any) => {
    return React.forwardRef((props: any, ref: any) => {
        return <Component collapsibleStack={useCollapsibleStack()} ref={ref} {...props} />;
    });
};
