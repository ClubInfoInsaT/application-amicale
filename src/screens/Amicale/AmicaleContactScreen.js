// @flow

import * as React from 'react';
import {Animated, FlatList, Image, Linking, View} from 'react-native';
import {Card, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import {Collapsible} from "react-navigation-collapsible";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";

type Props = {
    collapsibleStack: Collapsible
};

type State = {};

/**
 * Class defining a planning event information page.
 */
class AmicaleContactScreen extends React.Component<Props, State> {


    CONTACT_DATASET = [
        {
            name: i18n.t("amicaleAbout.roles.interSchools"),
            email: "inter.ecoles@amicale-insat.fr",
            icon: "share-variant"
        },
        {
            name: i18n.t("amicaleAbout.roles.culture"),
            email: "culture@amicale-insat.fr",
            icon: "book"
        },
        {
            name: i18n.t("amicaleAbout.roles.animation"),
            email: "animation@amicale-insat.fr",
            icon: "emoticon"
        },
        {
            name: i18n.t("amicaleAbout.roles.clubs"),
            email: "clubs@amicale-insat.fr",
            icon: "account-group"
        },
        {
            name: i18n.t("amicaleAbout.roles.event"),
            email: "evenements@amicale-insat.fr",
            icon: "calendar-range"
        },
        {
            name: i18n.t("amicaleAbout.roles.tech"),
            email: "technique@amicale-insat.fr",
            icon: "settings"
        },
        {
            name: i18n.t("amicaleAbout.roles.communication"),
            email: "amicale@amicale-insat.fr",
            icon: "comment-account"
        },
        {
            name: i18n.t("amicaleAbout.roles.intraSchools"),
            email: "intra.ecoles@amicale-insat.fr",
            icon: "school"
        },
        {
            name: i18n.t("amicaleAbout.roles.publicRelations"),
            email: "rp@amicale-insat.fr",
            icon: "account-tie"
        },
    ];

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    keyExtractor = (item: Object) => item.email;

    getChevronIcon = (props: Object) => <List.Icon {...props} icon={'chevron-right'}/>;

    renderItem = ({item}: Object) => {
        const onPress = () => Linking.openURL('mailto:' + item.email);
        return <List.Item
            title={item.name}
            description={item.email}
            left={(props) => <List.Icon {...props} icon={item.icon}/>}
            right={this.getChevronIcon}
            onPress={onPress}
        />
    };

    getScreen = () => {
        return (
            <View>
                <View style={{
                    width: '100%',
                    height: 100,
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        source={require('../../../assets/amicale.png')}
                        style={{flex: 1, resizeMode: "contain"}}
                        resizeMode="contain"/>
                </View>
                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t("amicaleAbout.title")}
                        subtitle={i18n.t("amicaleAbout.subtitle")}
                        left={props => <List.Icon {...props} icon={'information'}/>}
                    />
                    <Card.Content>
                        <Text>{i18n.t("amicaleAbout.message")}</Text>
                        {/*$FlowFixMe*/}
                        <FlatList
                            data={this.CONTACT_DATASET}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                        />
                    </Card.Content>
                </Card>
            </View>
        );
    };

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <Animated.FlatList
                data={[{key: "1"}]}
                renderItem={this.getScreen}
                // Animations
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingTop: containerPaddingTop,
                    paddingBottom: CustomTabBar.TAB_BAR_HEIGHT,
                    minHeight: '100%'
                }}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            />
        );
    }
}

export default withCollapsible(withTheme(AmicaleContactScreen));
