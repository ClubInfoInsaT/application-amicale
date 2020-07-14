// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import i18n from "i18n-js";
import {Card, List, Paragraph, Text, Title} from 'react-native-paper';
import CustomTabBar from "../../components/Tabbar/CustomTabBar";

type Props = {};

const LOGO = "https://etud.insa-toulouse.fr/~amicale_app/images/Proxiwash.png";

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
                        source={{uri: LOGO}}
                        style={{height: '100%', width: '100%', resizeMode: "contain"}}/>
                </View>
                <Text>{i18n.t('screens.proxiwash.description')}</Text>
                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('screens.proxiwash.dryer')}
                        left={props => <List.Icon {...props} icon={'tumble-dryer'}/>}
                    />
                    <Card.Content>
                        <Title>{i18n.t('screens.proxiwash.procedure')}</Title>
                        <Paragraph>{i18n.t('screens.proxiwash.dryerProcedure')}</Paragraph>
                        <Title>{i18n.t('screens.proxiwash.tips')}</Title>
                        <Paragraph>{i18n.t('screens.proxiwash.dryerTips')}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('screens.proxiwash.washer')}
                        left={props => <List.Icon {...props} icon={'washing-machine'}/>}
                    />
                    <Card.Content>
                        <Title>{i18n.t('screens.proxiwash.procedure')}</Title>
                        <Paragraph>{i18n.t('screens.proxiwash.washerProcedure')}</Paragraph>
                        <Title>{i18n.t('screens.proxiwash.tips')}</Title>
                        <Paragraph>{i18n.t('screens.proxiwash.washerTips')}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={{margin: 5}}>
                    <Card.Title
                        title={i18n.t('screens.proxiwash.tariffs')}
                        left={props => <List.Icon {...props} icon={'circle-multiple'}/>}
                    />
                    <Card.Content>
                        <Paragraph>{i18n.t('screens.proxiwash.washersTariff')}</Paragraph>
                        <Paragraph>{i18n.t('screens.proxiwash.dryersTariff')}</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={{margin: 5, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                    <Card.Title
                        title={i18n.t('screens.proxiwash.paymentMethods')}
                        left={props => <List.Icon {...props} icon={'cash'}/>}
                    />
                    <Card.Content>
                        <Paragraph>{i18n.t('screens.proxiwash.paymentMethodsDescription')}</Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }
}
