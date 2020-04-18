// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import i18n from "i18n-js";
import {Card, List, Paragraph, Text, Title} from 'react-native-paper';
import CustomTabBar from "../../components/Tabbar/CustomTabBar";

type Props = {
    navigation: Object,
};

/**
 * Class defining the proxiwash about screen.
 */
export default class ProxiwashAboutScreen extends React.Component<Props> {

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
                        source={require('../../../assets/proxiwash-logo.png')}
                        style={{flex: 1, resizeMode: "contain"}}
                        resizeMode="contain"/>
                </View>
                <Text>{i18n.t('proxiwashScreen.description')}</Text>
                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('proxiwashScreen.dryer')}
                        left={props => <List.Icon {...props} icon={'tumble-dryer'}/>}
                    />
                    <Card.Content>
                        <Title>{i18n.t('proxiwashScreen.procedure')}</Title>
                        <Paragraph>{i18n.t('proxiwashScreen.dryerProcedure')}</Paragraph>
                        <Title>{i18n.t('proxiwashScreen.tips')}</Title>
                        <Paragraph>{i18n.t('proxiwashScreen.dryerTips')}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('proxiwashScreen.washer')}
                        left={props => <List.Icon {...props} icon={'washing-machine'}/>}
                    />
                    <Card.Content>
                        <Title>{i18n.t('proxiwashScreen.procedure')}</Title>
                        <Paragraph>{i18n.t('proxiwashScreen.washerProcedure')}</Paragraph>
                        <Title>{i18n.t('proxiwashScreen.tips')}</Title>
                        <Paragraph>{i18n.t('proxiwashScreen.washerTips')}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('proxiwashScreen.tariffs')}
                        left={props => <List.Icon {...props} icon={'coins'}/>}
                    />
                    <Card.Content>
                        <Paragraph>{i18n.t('proxiwashScreen.washersTariff')}</Paragraph>
                        <Paragraph>{i18n.t('proxiwashScreen.dryersTariff')}</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={{margin: 5, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                    <Card.Title
                        title={i18n.t('proxiwashScreen.paymentMethods')}
                        left={props => <List.Icon {...props} icon={'cash'}/>}
                    />
                    <Card.Content>
                        <Paragraph>{i18n.t('proxiwashScreen.paymentMethodsDescription')}</Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }
}
