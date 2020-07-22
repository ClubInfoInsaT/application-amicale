// @flow

import * as React from 'react';
import {Animated} from "react-native";
import type {CollapsibleComponentProps} from "./CollapsibleComponent";
import CollapsibleComponent from "./CollapsibleComponent";

type Props = {
    ...CollapsibleComponentProps
}

class CollapsibleScrollView extends React.Component<Props> {

    render() {
        return (
            <CollapsibleComponent
                {...this.props}
                component={Animated.ScrollView}
            >
                {this.props.children}
            </CollapsibleComponent>
        );
    }
}

export default CollapsibleScrollView;
