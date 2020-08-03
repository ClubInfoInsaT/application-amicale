// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Button, Card, TouchableRipple} from 'react-native-paper';
import {getFormattedEventTime, isDescriptionEmpty} from '../../utils/Planning';
import CustomHTML from '../Overrides/CustomHTML';
import type {EventType} from '../../screens/Home/HomeScreen';

type PropsType = {
  event?: EventType | null,
  clickAction: () => void,
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    maxHeight: 150,
    overflow: 'hidden',
  },
  actions: {
    marginLeft: 'auto',
    marginTop: 'auto',
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
});

/**
 * Component used to display an event preview if an event is available
 */
// eslint-disable-next-line react/prefer-stateless-function
class PreviewEventDashboardItem extends React.Component<PropsType> {
  static defaultProps = {
    event: null,
  };

  render(): React.Node {
    const {props} = this;
    const {event} = props;
    const isEmpty =
      event == null ? true : isDescriptionEmpty(event.description);

    if (event != null) {
      const hasImage = event.logo !== '' && event.logo != null;
      const getImage = (): React.Node => (
        <Avatar.Image
          source={{uri: event.logo}}
          size={50}
          style={styles.avatar}
        />
      );
      return (
        <Card style={styles.card} elevation={3}>
          <TouchableRipple style={{flex: 1}} onPress={props.clickAction}>
            <View>
              {hasImage ? (
                <Card.Title
                  title={event.title}
                  subtitle={getFormattedEventTime(
                    event.date_begin,
                    event.date_end,
                  )}
                  left={getImage}
                />
              ) : (
                <Card.Title
                  title={event.title}
                  subtitle={getFormattedEventTime(
                    event.date_begin,
                    event.date_end,
                  )}
                />
              )}
              {!isEmpty ? (
                <Card.Content style={styles.content}>
                  <CustomHTML html={event.description} />
                </Card.Content>
              ) : null}

              <Card.Actions style={styles.actions}>
                <Button icon="chevron-right">
                  {i18n.t('screens.home.dashboard.seeMore')}
                </Button>
              </Card.Actions>
            </View>
          </TouchableRipple>
        </Card>
      );
    }
    return null;
  }
}

export default PreviewEventDashboardItem;
