// @flow

import * as React from 'react';
import {Image, Linking, View} from 'react-native';
import {Card, CardItem, Container, Content, H2, Left, Tab, TabHeading, Tabs, Text} from 'native-base';
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
                                    color={'#fff'}
                                    fontSize={20}
                                />
                                <Text>Information</Text>
                            </TabHeading>
                        }
                        key={1}
                        style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
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
                        <Content padder>
                            <Text>Ta laverie directement sur le campus, au pied du R3.</Text>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'tumble-dryer'}/>
                                        <H2>Seche linge</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Text>Coucou</Text>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'washing-machine'}/>
                                        <H2>Machine a laver</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Text>Coucou</Text>
                                </CardItem>
                            </Card>
                        </Content>
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading>
                                <CustomMaterialIcon
                                    icon={'cash'}
                                    color={'#fff'}
                                    fontSize={20}
                                />
                                <Text>Payment</Text>
                            </TabHeading>
                        }
                        key={2}
                        style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                        <Content padder>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'coins'}/>
                                        <H2>Tarifs</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Text>Coucou</Text>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <CustomMaterialIcon icon={'cash'}/>
                                        <H2>Moyens de Paiement</H2>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Text>Coucou</Text>
                                </CardItem>
                            </Card>
                        </Content>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
