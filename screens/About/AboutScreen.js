// @flow

import * as React from 'react';
import {Platform, StyleSheet, Linking, Alert, FlatList} from 'react-native';
import {Container, Content, Text, Card, CardItem, Body, Left, Right, Thumbnail, H1} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import i18n from "i18n-js";
import appJson from '../../app';
import packageJson from '../../package';
import CustomMaterialIcon from "../../components/CustomMaterialIcon";

const links = {
    appstore: 'https://qwant.com',
    playstore: 'https://qwant.com',
    gitlab: 'https://qwant.com',
    bugs: 'https://qwant.com',
    changelog: 'https://qwant.com',
    license: 'https://qwant.com',
    mail: "mailto:arnaud.vergnet@netc.fr?subject=Application Amicale INSA Toulouse&body=",
    linkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    facebook: 'https://www.facebook.com/arnaud.vergnet',
    react: 'https://facebook.github.io/react-native/',
};

type Props = {
    navigation: Object,
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
export default class AboutScreen extends React.Component<Props> {

    /**
     * Data to be displayed in the app card
     */
    appData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(Platform.OS === "ios" ? links.appstore : links.playstore),
            icon: Platform.OS === "ios" ? 'apple' : 'google-play',
            text: Platform.OS === "ios" ? i18n.t('aboutScreen.appstore') : i18n.t('aboutScreen.playstore'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.gitlab),
            icon: 'git',
            text: 'Gitlab',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.bugs),
            icon: 'bug',
            text: i18n.t('aboutScreen.bugs'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.changelog),
            icon: 'refresh',
            text: i18n.t('aboutScreen.changelog'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.license),
            icon: 'file-document',
            text: i18n.t('aboutScreen.license'),
            showChevron: true
        },
    ];

    /**
     * Data to be displayed in the author card
     */
    authorData: Array<Object> = [
        {
            onPressCallback: () => Alert.alert('Coucou', 'Whaou'),
            icon: 'account-circle',
            text: 'Arnaud VERGNET',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.mail),
            icon: 'email',
            text: i18n.t('aboutScreen.mail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.linkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.facebook),
            icon: 'facebook',
            text: 'Facebook',
            showChevron: true
        },
    ];

    /**
     * Data to be displayed in the technologies card
     */
    technoData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(links.react),
            icon: 'react',
            text: i18n.t('aboutScreen.reactNative'),
            showChevron: false
        },
        {
            onPressCallback: () => this.props.navigation.navigate('AboutDependenciesScreen', {data: packageJson.dependencies}),
            icon: 'developer-board',
            text: i18n.t('aboutScreen.libs'),
            showChevron: true
        },
    ];

    /**
     * Get a clickable card item to be rendered inside a card.
     *
     * @param onPressCallback The callback to use when the item is clicked
     * @param icon The icon name to use from MaterialCommunityIcons
     * @param text The text to show
     * @param showChevron Whether to show a chevron indicating this button will change screen
     * @returns {React.Node}
     */
    static getCardItem(onPressCallback: Function, icon: string, text: string, showChevron: boolean) {
        return (
            <CardItem button
                      onPress={onPressCallback}>
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                    <Text>{text}</Text>
                </Left>
                {showChevron ?
                    <Right>
                        <CustomMaterialIcon icon="chevron-right"
                                            fontSize={20}/>
                    </Right>
                    :
                    <Right/>
                }
            </CardItem>)
            ;
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.about')}/>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail square source={require('../../assets/amicale.png')}/>
                                <Body>
                                    <H1>Amicale INSA Toulouse</H1>
                                    <Text note>
                                        v.{appJson.expo.version}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <FlatList
                            data={this.appData}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                AboutScreen.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron)
                            }
                        />
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.author')}</Text>
                        </CardItem>
                        <FlatList
                            data={this.authorData}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                AboutScreen.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron)
                            }
                        />
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.technologies')}</Text>
                        </CardItem>
                        <FlatList
                            data={this.technoData}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                AboutScreen.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron)
                            }
                        />
                    </Card>
                </Content>
            </Container>
        );
    }
}
