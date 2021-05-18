/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Portal } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Mascot from './Mascot';
import GENERAL_STYLES from '../../constants/Styles';
import MascotSpeechBubble, {
  MascotSpeechBubbleProps,
} from './MascotSpeechBubble';
import { useMountEffect } from '../../utils/customHooks';
import { useRoute } from '@react-navigation/core';
import { useShouldShowMascot } from '../../context/preferencesContext';

type PropsType = MascotSpeechBubbleProps & {
  emotion: number;
  visible?: boolean;
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: -80,
    width: '100%',
  },
});

const MASCOT_SIZE = Dimensions.get('window').height / 6;
const BUBBLE_HEIGHT = Dimensions.get('window').height / 3;

/**
 * Component used to display a popup with the mascot.
 */
function MascotPopup(props: PropsType) {
  const route = useRoute();
  const { shouldShow, setShouldShow } = useShouldShowMascot(route.name);

  const isVisible = () => {
    if (props.visible !== undefined) {
      return props.visible;
    } else {
      return shouldShow;
    }
  };

  const [shouldRenderDialog, setShouldRenderDialog] = useState(isVisible());
  const [dialogVisible, setDialogVisible] = useState(isVisible());
  const lastVisibleProps = useRef(props.visible);
  const lastVisibleState = useRef(dialogVisible);

  useMountEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
  });

  useEffect(() => {
    if (props.visible && !dialogVisible) {
      setShouldRenderDialog(true);
      setDialogVisible(true);
    } else if (
      lastVisibleProps.current !== props.visible ||
      (!dialogVisible && dialogVisible !== lastVisibleState.current)
    ) {
      setDialogVisible(false);
      setTimeout(onAnimationEnd, 400);
    }
    lastVisibleProps.current = props.visible;
    lastVisibleState.current = dialogVisible;
  }, [props.visible, dialogVisible]);

  const onAnimationEnd = () => {
    setShouldRenderDialog(false);
  };

  const onBackButtonPressAndroid = (): boolean => {
    if (dialogVisible) {
      const { cancel } = props.buttons;
      const { action } = props.buttons;
      if (cancel) {
        onDismiss(cancel.onPress);
      } else if (action) {
        onDismiss(action.onPress);
      } else {
        onDismiss();
      }
      return true;
    }
    return false;
  };

  const getSpeechBubble = () => {
    return (
      <MascotSpeechBubble
        title={props.title}
        message={props.message}
        icon={props.icon}
        buttons={props.buttons}
        visible={dialogVisible}
        onDismiss={onDismiss}
        speechArrowPos={MASCOT_SIZE / 3}
        bubbleMaxHeight={BUBBLE_HEIGHT}
      />
    );
  };

  const getMascot = () => {
    return (
      <Animatable.View
        useNativeDriver
        animation={dialogVisible ? 'bounceInLeft' : 'bounceOutLeft'}
        duration={dialogVisible ? 1500 : 200}
      >
        <Mascot
          style={{ width: MASCOT_SIZE }}
          animated
          emotion={props.emotion}
        />
      </Animatable.View>
    );
  };

  const getBackground = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          onDismiss(props.buttons.cancel?.onPress);
        }}
      >
        <Animatable.View
          style={styles.background}
          useNativeDriver
          animation={dialogVisible ? 'fadeIn' : 'fadeOut'}
          duration={dialogVisible ? 300 : 300}
        />
      </TouchableWithoutFeedback>
    );
  };

  const onDismiss = (callback?: () => void) => {
    setShouldShow(false);
    setDialogVisible(false);
    if (callback) {
      callback();
    }
  };

  if (shouldRenderDialog) {
    return (
      <Portal>
        {getBackground()}
        <View style={GENERAL_STYLES.centerVertical}>
          <View style={styles.container}>
            {getMascot()}
            {getSpeechBubble()}
          </View>
        </View>
      </Portal>
    );
  }
  return null;
}

export default MascotPopup;
