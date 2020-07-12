// @flow

import * as React from 'react';
import {Avatar, Button, Card, Text} from 'react-native-paper';
import {View} from "react-native";
import Autolink from "react-native-autolink";
import i18n from "i18n-js";
import ImageModal from 'react-native-image-modal';
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";
import type {feedItem} from "../../screens/Home/HomeScreen";

const ICON_AMICALE = require('../../../assets/amicale.png');

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    item: feedItem,
    title: string,
    subtitle: string,
    height: number,
}


/**
 * Component used to display a feed item
 */
class FeedItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    /**
     * Gets the amicale INSAT logo
     *
     * @return {*}
     */
    getAvatar() {
        return (
            <Avatar.Image
                size={48} source={ICON_AMICALE}
                style={{backgroundColor: 'transparent'}}/>
        );
    }

    onPress = () => {
        this.props.navigation.navigate(
            'feed-information',
            {
                data: this.props.item,
                date: this.props.subtitle
            });
    };

    render() {
        const item = this.props.item;
        const hasImage = item.full_picture !== '' && item.full_picture !== undefined;

        const cardMargin = 10;
        const cardHeight = this.props.height - 2 * cardMargin;
        const imageSize = 250;
        const titleHeight = 80;
        const actionsHeight = 60;
        const textHeight = hasImage
            ? cardHeight - titleHeight - actionsHeight - imageSize
            : cardHeight - titleHeight - actionsHeight;
        return (
            <Card
                style={{
                    margin: cardMargin,
                    height: cardHeight,
                }}
                onPress={this.onPress}
            >
                <Card.Title
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    left={this.getAvatar}
                    style={{height: titleHeight}}
                />
                {hasImage ?
                    <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <ImageModal
                            resizeMode="contain"
                            imageBackgroundColor={"#000"}
                            style={{
                                width: imageSize,
                                height: imageSize,
                            }}
                            source={{
                                uri: item.full_picture,
                            }}
                        /></View> : null}
                <Card.Content>
                    {item.message !== undefined ?
                        <Autolink
                            text={item.message}
                            hashtag="facebook"
                            component={Text}
                            style={{height: textHeight}}
                        /> : null
                    }
                </Card.Content>
                <Card.Actions style={{height: actionsHeight}}>
                    <Button
                        onPress={this.onPress}
                        icon={'plus'}
                        style={{marginLeft: 'auto'}}>
                        {i18n.t('screens.home.dashboard.seeMore')}
                    </Button>
                </Card.Actions>
            </Card>
        );
    }
}

export default FeedItem;
