import React from 'react';
import {useSafeArea} from 'react-native-safe-area-context';

export const withSafeArea = (Component: any) => {
    return React.forwardRef((props: any, ref: any) => {
        let safeArea = useSafeArea();
        // safeArea.bottom = 0;
        return <Component
            safeArea={safeArea}
            ref={ref}
            {...props}
        />;
    });
};
