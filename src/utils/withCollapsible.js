import React from 'react';
import {useCollapsibleStack} from "react-navigation-collapsible";

export const withCollapsible = (Component: any) => {
    return (props: any) => {
        return <Component collapsibleStack={useCollapsibleStack()} {...props} />;
    };
};
