import React from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  useTheme,
  Paragraph,
  Text,
} from 'react-native-paper';
import Urls from '../../../constants/Urls';
import i18n from 'i18n-js';
import { CustomWhiteTheme } from '../../../utils/Themes';
import AcceptTermsDialog from './AcceptTermsDialog';

type Props = {
  termsUrl?: string;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderColor: CustomWhiteTheme.colors.warning,
    borderWidth: 5,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  editButton: {
    marginLeft: 'auto',
  },
  title: {
    marginLeft: 10,
  },
});

export default function ProfileTermsAlertCard(props: Props) {
  const termsUrl = props.termsUrl ?? Urls.amicale.tos;
  const theme = useTheme();
  const [showDialog, setShowDialog] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const openURLinBrowser = (url: string) => {
    // sub-optimal error handling
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <View>
      {hidden ? undefined : (
        <Card style={styles.card}>
          <Card.Title
            title={i18n.t('screens.profile.tos')}
            left={(iconProps) => (
              <Avatar.Icon
                size={iconProps.size}
                icon="alert-box"
                color={theme.colors.primary}
                style={styles.icon}
              />
            )}
          />
          <Card.Content>
            <Divider />
            <Paragraph>
              {i18n.t('screens.profile.tosParagraphOne')}
              <Text
                style={{ color: 'blue' }}
                onPress={() => openURLinBrowser(termsUrl)}
              >
                {i18n.t('screens.profile.tos')}
              </Text>{' '}
              {i18n.t('screens.profile.tosParagraphTwo')}
            </Paragraph>
            <Divider />
            <Card.Actions>
              <Button
                icon="text-box-check"
                mode="contained"
                onPress={() => setShowDialog(true)}
                style={styles.editButton}
              >
                {i18n.t('screens.profile.accept')}
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>
      )}
      {showDialog ? (
        <AcceptTermsDialog
          visible={showDialog}
          onDismiss={() => {
            setHidden(true);
            setShowDialog(false);
          }}
        />
      ) : undefined}
    </View>
  );
}
