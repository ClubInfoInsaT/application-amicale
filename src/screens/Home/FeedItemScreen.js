// @flow

import * as React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {Avatar, Card, Text, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import Autolink from "react-native-autolink";
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";

type Props = {
    navigation: Object,
    route: Object
};

const ICON_AMICALE = require('../../../assets/amicale.png');
const NAME_AMICALE = 'Amicale INSA Toulouse';
/**
 * Class defining a planning event information page.
 */
class FeedItemScreen extends React.Component<Props> {

    displayData: Object;
    date: string;

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.displayData = this.props.route.params.data;
        this.date = this.props.route.params.date;
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getHeaderButton,
        });
    }

    onOutLinkPress = () => {
        Linking.openURL(this.displayData.permalink_url);
    };

    getHeaderButton = () => {
        return <MaterialHeaderButtons>
            <Item title="main" iconName={'facebook'} onPress={this.onOutLinkPress}/>
        </MaterialHeaderButtons>;
    };

    getAvatar() {
        return (
            <Avatar.Image size={48} source={ICON_AMICALE}
                          style={{backgroundColor: 'transparent'}}/>
        );
    }

    getContent() {
        const hasImage = this.displayData.full_picture !== '' && this.displayData.full_picture !== undefined;
        return (
            <ScrollView style={{margin: 5,}}>
                <Card.Title
                    title={NAME_AMICALE}
                    subtitle={this.date}
                    left={this.getAvatar}
                />
                {hasImage ?
                    <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <ImageModal
                            resizeMode="contain"
                            imageBackgroundColor={"#000"}
                            style={{
                                width: 250,
                                height: 250,
                            }}
                            source={{
                                uri: this.displayData.full_picture,
                            }}
                        /></View> : null}
                <Card.Content style={{paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                    {this.displayData.message !== undefined ?
                        <Autolink
                            text={this.displayData.message}
                            hashtag="facebook"
                            component={Text}
                        /> : null
                    }
                </Card.Content>
            </ScrollView>
        );
    }

    render() {
        return this.getContent();
    }
}

export default withTheme(FeedItemScreen);
