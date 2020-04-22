// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import i18n from "i18n-js";
import {Card, List, Paragraph, Text} from 'react-native-paper';
import CustomTabBar from "../../components/Tabbar/CustomTabBar";

type Props = {
    navigation: Object,
};

const LOGO = "https://etud.insa-toulouse.fr/~amicale_app/images/proximo-logo.png";

/**
 * Class defining the proximo about screen.
 */
export default class ProximoAboutScreen extends React.Component<Props> {

    render() {
        return (
            <ScrollView style={{padding: 5}}>
                <View style={{
                    width: '100%',
                    height: 100,
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        source={{uri: LOGO}}
                        style={{height: '100%', width: '100%', resizeMode: "contain"}}/>
                </View>
                <Text>{i18n.t('proximoScreen.description')}</Text>
                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('proximoScreen.openingHours')}
                        left={props => <List.Icon {...props} icon={'clock-outline'}/>}
                    />
                    <Card.Content>
                        <Paragraph>18h30 - 19h30</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={{margin: 5, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                    <Card.Title
                        title={i18n.t('proximoScreen.paymentMethods')}
                        left={props => <List.Icon {...props} icon={'cash'}/>}
                    />
                    <Card.Content>
                        <Paragraph>{i18n.t('proximoScreen.paymentMethodsDescription')}</Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }
}
