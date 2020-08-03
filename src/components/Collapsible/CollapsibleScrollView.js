// @flow

import * as React from 'react';
import {Animated} from 'react-native';
import type {CollapsibleComponentPropsType} from './CollapsibleComponent';
import CollapsibleComponent from './CollapsibleComponent';

type PropsType = {
  ...CollapsibleComponentPropsType,
};

// eslint-disable-next-line react/prefer-stateless-function
class CollapsibleScrollView extends React.Component<PropsType> {
  render(): React.Node {
    const {props} = this;
    return (
      <CollapsibleComponent // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        component={Animated.ScrollView}>
        {props.children}
      </CollapsibleComponent>
    );
  }
}

export default CollapsibleScrollView;
