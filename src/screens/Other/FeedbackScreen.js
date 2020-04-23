// @flow

import * as React from 'react';
import {Avatar, Button, Card, Paragraph, withTheme} from "react-native-paper";
import i18n from "i18n-js";
import {ScrollView} from "react-native";
import {Linking} from "expo";
import type {CustomTheme} from "../../managers/ThemeManager";

type Props = {
    theme: CustomTheme
};

const links = {
    bugsMail: `mailto:vergnet@etud.insa-toulouse.fr
?subject=[BUG] Application CAMPUS
&body=Coucou Arnaud ça bug c'est nul,\n\n
Informations sur ton système si tu sais (iOS ou Android, modèle du tel, version):\n\n\n
Nature du problème :\n\n\n
Étapes pour reproduire ce pb :\n\n\n\n
Stp corrige le pb, bien cordialement.`,
    bugsGit: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues/new',
    facebook: "https://www.facebook.com/campus.insat",
    feedbackMail: `mailto:vergnet@etud.insa-toulouse.fr
?subject=[FEEDBACK] Application CAMPUS
&body=Coucou Arnaud j'ai du feedback\n\n\n\nBien cordialement.`,
    feedbackGit: "https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues/new",
}

class FeedbackScreen extends React.Component<Props> {

    getButtons(isBug: boolean) {
        return (
            <Card.Actions style={{
                flex: 1,
                flexWrap: 'wrap',
            }}>
                <Button
                    icon="email"
                    mode="contained"
                    style={{
                        marginLeft: 'auto',
                        marginTop: 5,
                    }}
                    onPress={() => Linking.openURL(isBug ? links.bugsMail : links.feedbackMail)}>
                    MAIL
                </Button>
                <Button
                    icon="git"
                    mode="contained"
                    style={{
                        marginLeft: 'auto',
                        marginTop: 5,
                    }}
                    onPress={() => Linking.openURL(isBug ? links.bugsGit : links.feedbackGit)}>
                    GITEA
                </Button>
                <Button
                    icon="facebook"
                    mode="contained"
                    style={{
                        marginLeft: 'auto',
                        marginTop: 5,
                    }}
                    onPress={() => Linking.openURL(links.facebook)}>
                    Facebook
                </Button>
            </Card.Actions>
        );
    }

    render() {
        return (
            <ScrollView style={{padding: 5}}>
                <Card>
                    <Card.Title
                        title={i18n.t('feedbackScreen.bugs')}
                        subtitle={i18n.t('feedbackScreen.bugsSubtitle')}
                        left={(props) => <Avatar.Icon {...props} icon="bug"/>}
                    />
                    <Card.Content>
                        <Paragraph>
                            {i18n.t('feedbackScreen.bugsDescription')}
                        </Paragraph>
                        <Paragraph style={{color: this.props.theme.colors.primary}}>
                            {i18n.t('feedbackScreen.contactMeans')}
                        </Paragraph>
                    </Card.Content>
                    {this.getButtons(true)}
                </Card>

                <Card style={{marginTop: 20, marginBottom: 10}}>
                    <Card.Title
                        title={i18n.t('feedbackScreen.feedback')}
                        subtitle={i18n.t('feedbackScreen.feedbackSubtitle')}
                        left={(props) => <Avatar.Icon {...props} icon="comment"/>}
                    />
                    <Card.Content>
                        <Paragraph>
                            {i18n.t('feedbackScreen.feedbackDescription')}
                        </Paragraph>
                    </Card.Content>
                    {this.getButtons(false)}
                </Card>
            </ScrollView>
        );
    }
}

export default withTheme(FeedbackScreen);