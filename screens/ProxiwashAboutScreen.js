// @flow

import * as React from 'react';
import {Image, Linking, View} from 'react-native';
import {Body, Card, CardItem, Container, Content, H2, H3, Left, Tab, TabHeading, Tabs, Text} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import i18n from "i18n-js";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";

type Props = {
    navigation: Object,
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
export default class ProxiwashAboutScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.proxiwash')} hasBackButton={true}/>
                <Tabs>
                    <Tab
                        heading={
                            <TabHeading>
                                <CustomMaterialIcon
                                    icon={'information'}
                                    color={ThemeManager.getCurrentThemeVariables().tabIconColor}
                                    fontSize={20}
                                />
                                <Text>{i18n.t('proxiwashScreen.informationTab')}</Text>
                            </TabHeading>
                        }
                        key={1}
                        style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
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
                                    source={require('../assets/proxiwash-logo.png')}
                                    style={{flex: 1, resizeMode: "contain"}}
                                    resizeMode="contain"/>
                            </View>
                            <Text>{i18n.t('proxiwashScreen.description')}</Text>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'tumble-dryer'}/>
                                        <H2>{i18n.t('proxiwashScreen.dryer')}</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <H3>{i18n.t('proxiwashScreen.procedure')}</H3>
                                        <Text>{i18n.t('proxiwashScreen.dryerProcedure')}</Text>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <H3>{i18n.t('proxiwashScreen.tips')}</H3>
                                        <Text>{i18n.t('proxiwashScreen.dryerTips')}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'washing-machine'}/>
                                        <H2>{i18n.t('proxiwashScreen.washer')}</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <H3>{i18n.t('proxiwashScreen.procedure')}</H3>
                                        <Text>{i18n.t('proxiwashScreen.washerProcedure')}</Text>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <H3>{i18n.t('proxiwashScreen.tips')}</H3>
                                        <Text>{i18n.t('proxiwashScreen.washerTips')}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading>
                                <CustomMaterialIcon
                                    icon={'cash'}
                                    color={ThemeManager.getCurrentThemeVariables().tabIconColor}
                                    fontSize={20}
                                />
                                <Text>{i18n.t('proxiwashScreen.paymentTab')}</Text>
                            </TabHeading>
                        }
                        key={2}
                        style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                        <Content padder>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'coins'}/>
                                        <H2>{i18n.t('proxiwashScreen.tariffs')}</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>{i18n.t('proxiwashScreen.washersTariff')}</Text>
                                        <Text>{i18n.t('proxiwashScreen.dryersTariff')}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'cash'}/>
                                        <H2>{i18n.t('proxiwashScreen.paymentMethods')}</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>{i18n.t('proxiwashScreen.paymentMethodsDescription')}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
