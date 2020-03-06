// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import i18n from "i18n-js";
import appJson from '../../app';
import AsyncStorageManager from "../../utils/AsyncStorageManager";
import {Modalize} from "react-native-modalize";
import ThemeManager from "../../utils/ThemeManager";
import {Avatar, Card, Text, Title, List, Button} from 'react-native-paper';

const links = {
    appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
    playstore: 'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
    git: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/README.md',
    bugsMail: 'mailto:vergnet@etud.insa-toulouse.fr?' +
        'subject=' +
        '[BUG] Application Amicale INSA Toulouse' +
        '&body=' +
        'Coucou Arnaud ça bug c\'est nul,\n\n' +
        'Informations sur ton système si tu sais (iOS ou Android, modèle du tel, version):\n\n\n' +
        'Nature du problème :\n\n\n' +
        'Étapes pour reproduire ce pb :\n\n\n\n' +
        'Stp corrige le pb, bien cordialement.',
    bugsGit: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues',
    changelog: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/Changelog.md',
    license: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/LICENSE',
    authorMail: "mailto:vergnet@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    authorLinkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    yohanMail: "mailto:ysimard@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    yohanLinkedin: 'https://www.linkedin.com/in/yohan-simard',
    react: 'https://facebook.github.io/react-native/',
};

type Props = {
    navigation: Object,
};

type State = {
    isDebugUnlocked: boolean,
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
export default class AboutScreen extends React.Component<Props, State> {

    debugTapCounter = 0;
    modalRef: { current: null | Modalize };

    state = {
        isDebugUnlocked: AsyncStorageManager.getInstance().preferences.debugUnlocked.current === '1'
    };
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
            onPressCallback: () => this.openBugReportModal(),
            icon: 'bug',
            text: i18n.t('aboutScreen.bugs'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.git),
            icon: 'git',
            text: 'Git',
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
        {
            onPressCallback: () => this.props.navigation.navigate('DebugScreen'),
            icon: 'bug-check',
            text: i18n.t('aboutScreen.debug'),
            showChevron: true,
            showOnlyDebug: true
        },
    ];
    /**
     * Data to be displayed in the author card
     */
    authorData: Array<Object> = [
        {
            onPressCallback: () => this.tryUnlockDebugMode(),
            icon: 'account-circle',
            text: 'Arnaud VERGNET',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.authorMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.authorLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the additional developer card
     */
    additionalDevData: Array<Object> = [
        {
            onPressCallback: () => console.log('Meme this'),
            icon: 'account',
            text: 'Yohan SIMARD',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.yohanMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.yohanLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
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
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('AboutDependenciesScreen'),
            icon: 'developer-board',
            text: i18n.t('aboutScreen.libs'),
            showChevron: true
        },
    ];
    dataOrder: Array<Object> = [
        {
            id: 'app',
        },
        {
            id: 'team',
        },
        {
            id: 'techno',
        },
    ];

    getCardItem: Function;
    getMainCard: Function;

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
        this.getCardItem = this.getCardItem.bind(this);
        this.getMainCard = this.getMainCard.bind(this);
    }

    getAppCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Title
                    title={appJson.expo.name}
                    subtitle={appJson.expo.version}
                    left={(props) => <Avatar.Image {...props} source={require('../../assets/android.icon.png')}/>}/>
                <Card.Content>
                    <FlatList
                        data={this.appData}
                        extraData={this.state}
                        keyExtractor={(item) => item.icon}
                        listKey={"app"}
                        renderItem={this.getCardItem}
                    />
                </Card.Content>
            </Card>
        );
    }

    getTeamCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Title
                    title={i18n.t('aboutScreen.team')}
                    left={(props) => <Avatar.Icon {...props} icon={'account-multiple'}/>}/>
                <Card.Content>
                    <Title>{i18n.t('aboutScreen.author')}</Title>
                    <FlatList
                        data={this.authorData}
                        extraData={this.state}
                        keyExtractor={(item) => item.icon}
                        listKey={"team1"}
                        renderItem={this.getCardItem}
                    />
                    <Title>{i18n.t('aboutScreen.additionalDev')}</Title>
                    <FlatList
                        data={this.additionalDevData}
                        extraData={this.state}
                        keyExtractor={(item) => item.icon}
                        listKey={"team2"}
                        renderItem={this.getCardItem}
                    />
                </Card.Content>
            </Card>
        );
    }

    getTechnoCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Content>
                    <Title>{i18n.t('aboutScreen.technologies')}</Title>
                    <FlatList
                        data={this.technoData}
                        extraData={this.state}
                        keyExtractor={(item) => item.icon}
                        listKey={"techno"}
                        renderItem={this.getCardItem}
                    />
                </Card.Content>
            </Card>
        );
    }

    /**
     * Get a clickable card item to be rendered inside a card.
     *
     * @returns {React.Node}
     */
    getCardItem({item}: Object) {
        let shouldShow = !item.showOnlyInDebug || (item.showOnlyInDebug && this.state.isDebugUnlocked);
        console.log(item.text);
        if (shouldShow) {
            if (item.showChevron) {
                return (
                    <List.Item
                        title={item.text}
                        left={props => <List.Icon {...props} icon={item.icon} />}
                        right={props => <List.Icon {...props} icon={'chevron-right'} />}
                        onPress={item.onPressCallback}
                    />
                );
            } else {
                return (
                    <List.Item
                        title={item.text}
                        left={props => <List.Icon {...props} icon={item.icon} />}
                        onPress={item.onPressCallback}
                    />
                );
            }

        } else {
            return null;
        }

    }

    tryUnlockDebugMode() {
        this.debugTapCounter = this.debugTapCounter + 1;
        if (this.debugTapCounter >= 4) {
            this.unlockDebugMode();
        }
    }

    unlockDebugMode() {
        this.setState({isDebugUnlocked: true});
        let key = AsyncStorageManager.getInstance().preferences.debugUnlocked.key;
        AsyncStorageManager.getInstance().savePref(key, '1');
    }

    getBugReportModal() {
        const onPressMail = openWebLink.bind(this, links.bugsMail);
        const onPressGit = openWebLink.bind(this, links.bugsGit);
        return (
            <Modalize ref={this.modalRef}
                      adjustToContentHeight
                      modalStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().surface}}>
                <View style={{
                    flex: 1,
                    padding: 20
                }}>
                    <Title>{i18n.t('aboutScreen.bugs')}</Title>
                    <Text>
                        {i18n.t('aboutScreen.bugsDescription')}
                    </Text>
                    <Button
                        icon="email"
                        mode="contained"
                        dark={true}
                        color={ThemeManager.getCurrentThemeVariables().primary}
                        style={{
                            marginTop: 20,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onPress={onPressMail}>
                        <Text>{i18n.t('aboutScreen.bugsMail')}</Text>
                    </Button>
                    <Button
                        icon="git"
                        mode="contained"
                        dark={true}
                        color={ThemeManager.getCurrentThemeVariables().primary}
                        style={{
                            marginTop: 20,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onPress={onPressGit}>
                        <Text>{i18n.t('aboutScreen.bugsGit')}</Text>
                    </Button>
                </View>
            </Modalize>
        );
    }

    openBugReportModal() {
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    getMainCard({item}: Object) {
        switch (item.id) {
            case 'app':
                return this.getAppCard();
            case 'team':
                return this.getTeamCard();
            case 'techno':
                return this.getTechnoCard();
        }
        return <View/>;
    }

    render() {
        return (
            <View style={{padding: 5}}>
                {this.getBugReportModal()}
                <FlatList
                    style={{padding: 5}}
                    data={this.dataOrder}
                    extraData={this.state}
                    keyExtractor={(item) => item.id}
                    renderItem={this.getMainCard}
                />
            </View>
        );
    }
}
