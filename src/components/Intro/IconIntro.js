// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type PropsType = {
  icon: string,
};

const styles = StyleSheet.create({
  center: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

class IntroIcon extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {icon} = this.props;
    return (
      <View style={{flex: 1}}>
        <Animatable.View
          useNativeDriver
          style={styles.center}
          animation="fadeIn">
          <MaterialCommunityIcons name={icon} color="#fff" size={200} />
        </Animatable.View>
      </View>
    );
  }
}

export default IntroIcon;
