// @flow

import * as React from 'react';
import {Image, Linking, View} from 'react-native';
import {Body, Card, CardItem, Container, Content, H2, Left, Text} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";

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
export default class ProximoAboutScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.proximo')} hasBackButton={true}/>
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
                    <Text>
                        Le Proximo c’est ta petite épicerie étudiante tenu par les étudiants directement sur le
                        campus. Ouvert tous les jours de 18h30 à 19h30, nous t’accueillons et te souvent quand tu n’as
                        plus de pâtes ou de diluant ! Différents produits pour différentes galère, le tout à prix
                        coûtant. Tu peux payer par Lydia ou par espèce.
                    </Text>
                    <Card>
                        <CardItem>
                            <Left>
                                <CustomMaterialIcon icon={'clock-outline'}/>
                                <H2>Horaires</H2>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Text>18h30 - 19h30</Text>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <CustomMaterialIcon icon={'cash'}/>
                                <H2>Paiement</H2>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Text>Espèce ou Lydia</Text>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
