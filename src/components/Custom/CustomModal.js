// @flow

import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {Modalize} from "react-native-modalize";

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
function CustomModal(props) {
    const {colors} = props.theme;
    return (
        <Modalize
            ref={props.onRef}
            adjustToContentHeight
            handlePosition={'inside'}
            modalStyle={{backgroundColor: colors.card}}
            handleStyle={{backgroundColor: colors.primary}}
        >
            {props.children}
        </Modalize>
    );
}

export default withTheme(CustomModal);

