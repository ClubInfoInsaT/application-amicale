import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import GENERAL_STYLES from '../../../constants/Styles';
import GameLogic, { MovementCallbackType } from '../logic/GameLogic';

type Props = {
  logic: GameLogic;
  onDirectionPressed: MovementCallbackType;
};

const styles = StyleSheet.create({
  controlsContainer: {
    height: 80,
    flexDirection: 'row',
  },
  directionsContainer: {
    flexDirection: 'row',
    flex: 4,
  },
});

function GameControls(props: Props) {
  const { logic } = props;
  const theme = useTheme();
  return (
    <View style={styles.controlsContainer}>
      <IconButton
        icon={'rotate-right-variant'}
        size={40}
        onPress={() => logic.rotatePressed(props.onDirectionPressed)}
        style={GENERAL_STYLES.flex}
      />
      <View style={styles.directionsContainer}>
        <IconButton
          icon={'chevron-left'}
          size={40}
          style={GENERAL_STYLES.flex}
          onPress={() => logic.pressedOut()}
          onPressIn={() => logic.leftPressedIn(props.onDirectionPressed)}
        />
        <IconButton
          icon={'chevron-right'}
          size={40}
          style={GENERAL_STYLES.flex}
          onPress={() => logic.pressedOut()}
          onPressIn={() => logic.rightPressed(props.onDirectionPressed)}
        />
      </View>
      <IconButton
        icon={'arrow-down-bold'}
        size={40}
        onPressIn={() => logic.downPressedIn(props.onDirectionPressed)}
        onPress={() => logic.pressedOut()}
        style={GENERAL_STYLES.flex}
        color={theme.colors.tetrisScore}
      />
    </View>
  );
}

export default React.memo(GameControls, () => true);
