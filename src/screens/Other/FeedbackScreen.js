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

// @flow

import * as React from 'react';
import {Avatar, Button, Card, Paragraph, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import {Linking, View} from 'react-native';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../constants/PaperStyles';

const links = {
  bugsGit: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/',
  trello: 'https://trello.com/b/RMej49Uq/application-campus-insa',
  facebook: 'https://www.facebook.com/campus.insat',
  feedbackMail: `mailto:app@amicale-insat.fr?subject=[FEEDBACK] Application CAMPUS
&body=Coucou Arnaud j'ai du feedback\n\n\n\nBien cordialement.`,
  feedbackDiscord: 'https://discord.gg/W8MeTec',
};

class FeedbackScreen extends React.Component<null> {
  /**
   * Gets link buttons
   *
   * @returns {*}
   */
  static getButtons(isFeedback: boolean): React.Node {
    return (
      <Card.Actions
        style={{
          flex: 1,
          flexWrap: 'wrap',
        }}>
        {isFeedback ? (
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              width: '100%',
            }}>
            <Button
              icon="email"
              mode="contained"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
              }}
              onPress={() => {
                Linking.openURL(links.feedbackMail);
              }}>
              MAIL
            </Button>
            <Button
              icon="facebook"
              mode="contained"
              color="#2e88fe"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
              }}
              onPress={() => {
                Linking.openURL(links.facebook);
              }}>
              Facebook
            </Button>
            <Button
              icon="discord"
              mode="contained"
              color="#7289da"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
              }}
              onPress={() => {
                Linking.openURL(links.feedbackDiscord);
              }}>
              Discord
            </Button>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              width: '100%',
            }}>
            <Button
              icon="git"
              mode="contained"
              color="#609927"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
              }}
              onPress={() => {
                Linking.openURL(links.bugsGit);
              }}>
              GITETUD
            </Button>
            <Button
              icon="calendar"
              mode="contained"
              color="#026AA7"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
              }}
              onPress={() => {
                Linking.openURL(links.trello);
              }}>
              TRELLO
            </Button>
          </View>
        )}
      </Card.Actions>
    );
  }

  render(): React.Node {
    return (
      <CollapsibleScrollView style={{padding: 5}}>
        <Card>
          <Card.Title
            title={i18n.t('screens.feedback.feedback')}
            subtitle={i18n.t('screens.feedback.feedbackSubtitle')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="comment" />
            )}
          />
          <Card.Content>
            <Paragraph>
              {i18n.t('screens.feedback.feedbackDescription')}
            </Paragraph>
          </Card.Content>
          {FeedbackScreen.getButtons(true)}
          <Card.Title
            title={i18n.t('screens.feedback.contribute')}
            subtitle={i18n.t('screens.feedback.contributeSubtitle')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="handshake" />
            )}
          />
          <Card.Content>
            <Paragraph>
              {i18n.t('screens.feedback.contributeDescription')}
            </Paragraph>
          </Card.Content>
          {FeedbackScreen.getButtons(false)}
        </Card>
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(FeedbackScreen);
