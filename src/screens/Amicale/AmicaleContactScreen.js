// @flow

import * as React from 'react';
import {Animated, FlatList, Image, Linking, View} from 'react-native';
import {Card, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import {Collapsible} from "react-navigation-collapsible";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import type {MaterialCommunityIconsGlyphs} from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
    collapsibleStack: Collapsible
};

type DatasetItem = {
    name: string,
    email: string,
    icon: MaterialCommunityIconsGlyphs,
}

/**
 * Class defining a planning event information page.
 */
class AmicaleContactScreen extends React.Component<Props> {

    // Dataset containing information about contacts
    CONTACT_DATASET: Array<DatasetItem>;

    constructor(props: Props) {
        super(props);
        this.CONTACT_DATASET = [
            {
                name: i18n.t("screens.amicaleAbout.roles.interSchools"),
                email: "inter.ecoles@amicale-insat.fr",
                icon: "share-variant"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.culture"),
                email: "culture@amicale-insat.fr",
                icon: "book"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.animation"),
                email: "animation@amicale-insat.fr",
                icon: "emoticon"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.clubs"),
                email: "clubs@amicale-insat.fr",
                icon: "account-group"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.event"),
                email: "evenements@amicale-insat.fr",
                icon: "calendar-range"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.tech"),
                email: "technique@amicale-insat.fr",
                icon: "cog"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.communication"),
                email: "amicale@amicale-insat.fr",
                icon: "comment-account"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.intraSchools"),
                email: "intra.ecoles@amicale-insat.fr",
                icon: "school"
            },
            {
                name: i18n.t("screens.amicaleAbout.roles.publicRelations"),
                email: "rp@amicale-insat.fr",
                icon: "account-tie"
            },
        ];
    }

    keyExtractor = (item: DatasetItem) => item.email;

    getChevronIcon = (props) => <List.Icon {...props} icon={'chevron-right'}/>;

    renderItem = ({item}: { item: DatasetItem }) => {
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
                        title={i18n.t("screens.amicaleAbout.title")}
                        subtitle={i18n.t("screens.amicaleAbout.subtitle")}
                        left={props => <List.Icon {...props} icon={'information'}/>}
                    />
                    <Card.Content>
                        <Text>{i18n.t("screens.amicaleAbout.message")}</Text>
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
