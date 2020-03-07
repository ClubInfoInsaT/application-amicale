import * as React from 'react';
import {Avatar, Button, Card, withTheme} from 'react-native-paper';
import {TouchableOpacity, View} from "react-native";
import Autolink from "react-native-autolink";
import i18n from "i18n-js";

const ICON_AMICALE = require('../assets/amicale.png');

function FeedItem(props) {
    const {colors} = props.theme;
    return (
        <Card style={{margin: 5}}>
            <Card.Title
                title={props.title}
                subtitle={props.subtitle}
                left={props => <Avatar.Image size={48} source={ICON_AMICALE}
                                             style={{backgroundColor: 'transparent'}}/>}
            />
            {props.full_picture !== '' && props.full_picture !== undefined ?
                <TouchableOpacity onPress={props.onImagePress}>
                    <Card.Cover source={{uri: props.full_picture}}/>
                </TouchableOpacity> : <View/>}
            <Card.Content>
                {props.message !== undefined ?
                    <Autolink
                        text={props.message}
                        hashtag="facebook"
                        style={{color: colors.text}}
                    /> : <View/>
                }
            </Card.Content>
            <Card.Actions>
                <Button
                    color={'#57aeff'}
                    onPress={props.onOutLinkPress}
                    icon={'facebook'}>{i18n.t('homeScreen.dashboard.seeMore')}</Button>
            </Card.Actions>
        </Card>
    );
}

export default withTheme(FeedItem);
