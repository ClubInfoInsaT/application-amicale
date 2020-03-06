// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import {Card, CardItem, Container, Content, H2, Left, Text} from 'native-base';
import i18n from "i18n-js";
import {MaterialCommunityIcons} from "@expo/vector-icons";

type Props = {
    navigation: Object,
};

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
export default class ProximoAboutScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <Content padder>
                    <View style={{
                        width: '100%',
                        height: 100,
                        marginTop: 20,
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={require('../../assets/proximo-logo.png')}
                            style={{flex: 1, resizeMode: "contain"}}
                            resizeMode="contain"/>
                    </View>
                    <Text>{i18n.t('proximoScreen.description')}</Text>
                    <Card>
                        <CardItem>
                            <Left>
                                <MaterialCommunityIcons
                                    name={'clock-outline'}
                                    size={30}/>
                                <H2>{i18n.t('proximoScreen.openingHours')}</H2>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Text>18h30 - 19h30</Text>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <MaterialCommunityIcons
                                    name={'cash'}
                                    size={30}/>
                                <H2>{i18n.t('proximoScreen.paymentMethods')}</H2>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Text>{i18n.t('proximoScreen.paymentMethodsDescription')}</Text>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
