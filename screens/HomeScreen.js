// @flow

import * as React from 'react';
import {Image, Linking, RefreshControl, FlatList} from 'react-native';
import {Container, Content, Text, Button, Card, CardItem, Left, Body, Thumbnail, H2, Toast} from 'native-base';
import CustomHeader from '../components/CustomHeader';
import i18n from "i18n-js";
import CustomMaterialIcon from '../components/CustomMaterialIcon';

const ICON_AMICALE = require('../assets/amicale.png');

type Props = {
    navigation: Object,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    data: Object,
};

const FB_URL = "https://graph.facebook.com/v3.3/amicale.deseleves/posts?fields=message%2Cfull_picture%2Ccreated_time%2Cpermalink_url&access_token=EAAGliUs4Ei8BAC9J8U6EpL8LKLImMhvcgBq6iWK2BPDAhjZB7v4t8Fy5q3SsdfUq8nPovQfyFmwURSrNGWypwwBC1VZAf7Vmfff76UkpZCm0KTp56TRVK0NkH9YI4kRO8VqEucejFCBPQZBflZASwSbfRGZBLi4FWqBopBTEZCXg7RZAiMM02WXKXcc7b3AOl6wZD";

let test_data = [
    {
        title: "News de l'Amicale",
        date: "June 15, 2019",
        thumbnail: require("../assets/amicale.png"),
        image: require("../assets/drawer-cover.png"),
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue sapien leo, ac dignissim odio dignissim sit amet. Quisque tempor, turpis sed scelerisque faucibus, dolor tortor porta sapien, eget tincidunt ante elit et ex. Sed sagittis dui non nisl aliquet viverra. Integer quis convallis enim, sit amet auctor ante. Praesent quis lacinia magna. Sed augue lacus, congue eu turpis vel, consectetur pellentesque nulla. Maecenas blandit diam odio, et finibus urna egestas non. Quisque congue finibus efficitur. Sed pretium mauris nec neque mattis, eu condimentum velit ultrices. Fusce eleifend porttitor nunc non suscipit. Aenean porttitor feugiat ipsum sit amet interdum. Maecenas tempor felis non tempus vehicula. Suspendisse sit amet eros neque. ",
        link: "https://en.wikipedia.org/wiki/Main_Page"
    },
    {
        title: "Lancement de la super appli de la mort avec un titre super long",
        date: "June 14, 2019",
        thumbnail: require("../assets/amicale.png"),
        image: require("../assets/image-missing.png"),
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue sapien leo, eget tincidunt ante elit et ex. Sed sagittis dui non nisl aliquet viverra. Integer quis convallis enim, sit amet auctor ante. Praesent quis lacinia magna. Sed augue lacus, congue eu turpis vel, consectetur pellentesque nulla. Maecenas blandit diam odio, et finibus urna egestas non. Quisque congue finibus efficitur. Sed pretium mauris nec neque mattis, eu condimentum velit ultrices. Fusce eleifend porttitor nunc non suscipit.",
        link: "https://en.wikipedia.org/wiki/Central_Link"
    }
];

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining the app's home screen
 */
export default class HomeScreen extends React.Component<Props, State> {

    state = {
        refreshing: false,
        firstLoading: true,
        data: {},
    };

    async readData() {
        try {
            let response = await fetch(FB_URL);
            let responseJson = await response.json();
            this.setState({
                data: responseJson
            });
        } catch (error) {
            console.log('Could not read data from server');
            console.log(error);
            this.setState({
                data: {}
            });
        }
    }

    isDataObjectValid() {
        return Object.keys(this.state.data).length > 0;
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.readData().then(() => {
            this.setState({
                refreshing: false,
                firstLoading: false
            });
            if (this.isDataObjectValid()) {
                Toast.show({
                    text: i18n.t('proxiwashScreen.listUpdated'),
                    buttonText: 'OK',
                    type: "success",
                    duration: 2000
                })
            } else {
                Toast.show({
                    text: i18n.t('proxiwashScreen.listUpdateFail'),
                    buttonText: 'OK',
                    type: "danger",
                    duration: 4000
                })
            }
        });
    };

    getRenderItem(item: Object) {
        return (
            <Card style={{flex: 0}}>
                <CardItem>
                    <Left>
                        <Thumbnail source={ICON_AMICALE}/>
                        <Body>
                            <Text>Amicale</Text>
                            <Text note>{item.created_time}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{uri: item.full_picture}}
                               style={{width: '100%', height: 200, flex: 1}}/>
                        <Text>{item.message}</Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent info
                        onPress={() => openWebLink(item.permalink_url)}>
                            <CustomMaterialIcon
                                icon="facebook"
                                color="#57aeff"
                                width={20}/>
                            <Text>En savoir plus</Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        );
    }

    /**
     * Refresh the data on first screen load
     */
    componentDidMount() {
        this._onRefresh();
    }


    render() {
        const nav = this.props.navigation;
        let displayData = this.state.data.data;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.home')}/>
                <Content padder>
                    <FlatList
                        data={displayData}
                        extraData={this.state}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        renderItem={({item}) =>
                            this.getRenderItem(item)
                        }
                    />
                </Content>
            </Container>
        );
    }
}
