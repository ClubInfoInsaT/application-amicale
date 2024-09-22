import React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Card,
  List,
  useTheme,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import i18n from 'i18n-js';
import { StyleSheet } from 'react-native';
import { useAuthenticatedRequest } from '../../../context/loginContext';
import RequestScreen from '../../../components/Screens/RequestScreen';
import ErrorView, { ErrorProps } from '../../Screens/ErrorView';

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  logoutOthersButton: {
    marginBottom: 10,
  },
});

export type ProfileSessionType = {
  lastSeen: number;
  userId: number;
  device: string;
};

type ProfileSessionResponse = {
  sessions: Array<ProfileSessionType>;
};

type Props = {
  logout: (session: string) => void;
};

export default function ProfileSessionsCard(props: Props) {
  const theme = useTheme();
  const request =
    useAuthenticatedRequest<ProfileSessionResponse>('auth/session');

  const renderSession = (session: ProfileSessionType, index: number) => {
    return (
      <List.Item
        key={index.toString()}
        title={
          session.device
            ? session.device
            : i18n.t('screens.profile.unknownDevice')
        }
        description={
          i18n.t('screens.profile.lastSeen') + new Date(session.lastSeen * 1000)
        }
        left={(leftProps) => (
          <List.Icon
            style={leftProps.style}
            color={theme.colors.primary}
            icon={'cellphone-check'}
          />
        )}
      />
    );
  };

  const getCard = (content: React.ReactElement) => {
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.profile.sessions')}
          subtitle={i18n.t('screens.profile.sessionsSubtitle')}
          left={(iconProps) => (
            <Avatar.Icon
              size={iconProps.size}
              icon="lock"
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>{content}</Card.Content>
      </Card>
    );
  };

  const getSuccessCard = (data: ProfileSessionResponse | undefined) => {
    let content = <View />;
    if (data && data.sessions) {
      const items = data.sessions.map(renderSession);
      content = (
        <Card.Content>
          <List.Section>{items}</List.Section>
          <Button
            icon="cellphone-remove"
            mode="contained"
            onPress={() => props.logout('others')}
            style={styles.logoutOthersButton}
          >
            {i18n.t('screens.profile.logOut')}
          </Button>
          <Button
            icon="cellphone-remove"
            mode="contained"
            onPress={() => props.logout('all')}
          >
            {i18n.t('screens.profile.disconnectAllDevices')}
          </Button>
        </Card.Content>
      );
    }
    return getCard(content);
  };

  const getErrorCard = (errorProps: ErrorProps) => {
    const content = (
      <Card.Content>
        <ErrorView {...errorProps} />
      </Card.Content>
    );
    return getCard(content);
  };

  const getLoadingCard = () => {
    const content = (
      <Card.Content>
        <ActivityIndicator
          animating
          size="large"
          color={theme.colors.primary}
        />
      </Card.Content>
    );
    return getCard(content);
  };

  return (
    <RequestScreen
      request={request}
      render={getSuccessCard}
      renderLoading={getLoadingCard}
      renderError={getErrorCard}
    />
  );
}
