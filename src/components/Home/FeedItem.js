import * as React from 'react';
import {Avatar, Button, Card, Text, withTheme} from 'react-native-paper';
import {View} from "react-native";
import Autolink from "react-native-autolink";
import i18n from "i18n-js";
import ImageModal from 'react-native-image-modal';

const ICON_AMICALE = require('../../../assets/amicale.png');

/**
 * Component used to display a feed item
 */
class FeedItem extends React.Component {

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
            <Avatar.Image size={48} source={ICON_AMICALE}
                          style={{backgroundColor: 'transparent'}}/>
        );
    }

    render() {
        return (
            <Card style={{margin: 10}}>
                <Card.Title
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    left={this.getAvatar}
                />
                {this.props.full_picture !== '' && this.props.full_picture !== undefined ?
                    <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <ImageModal
                            resizeMode="contain"
                            imageBackgroundColor={"#000"}
                            style={{
                                width: 250,
                                height: 250,
                            }}
                            source={{
                                uri: this.props.full_picture,
                            }}
                        /></View> : <View/>}
                <Card.Content>
                    {this.props.message !== undefined ?
                        <Autolink
                            text={this.props.message}
                            hashtag="facebook"
                            component={Text}
                        /> : <View/>
                    }
                </Card.Content>
                <Card.Actions>
                    <Button
                        color={'#57aeff'}
                        onPress={this.props.onOutLinkPress}
                        icon={'facebook'}>
                        {i18n.t('homeScreen.dashboard.seeMore')}
                    </Button>
                </Card.Actions>
            </Card>
        );
    }
}

export default withTheme(FeedItem);
