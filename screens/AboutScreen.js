import React from 'react';
import {Platform, StyleSheet, Linking, Alert} from 'react-native';
import {Container, Content, Text, Card, CardItem, Body, Icon, Left, Right, Thumbnail, H1} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import i18n from "i18n-js";

const version = 'a0.0.1';
const links = {
    appstore: 'https://qwant.com',
    playstore: 'https://qwant.com',
    gitlab: 'https://qwant.com',
    bugs: 'https://qwant.com',
    changelog: 'https://qwant.com',
    license: 'https://qwant.com',
    mail: "mailto:arnaud.vergnet@netc.fr?subject=Application Amicale INSA Toulouse&body=",
    linkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    facebook: 'https://www.facebook.com/arnaud.vergnet',
    react: 'https://facebook.github.io/react-native/',
};


export default class AboutScreen extends React.Component {

    openWebLink(link) {
        Linking.openURL(link).catch((err) => console.error('Error opening link', err));
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.about')}/>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail square source={require('../assets/amicale.png')}/>
                                <Body>
                                    <H1>Amicale INSA Toulouse</H1>
                                    <Text note>
                                        v.{version}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(Platform.OS === "ios" ? links.appstore : links.playstore)}>
                            <Left>
                                <Icon active name={Platform.OS === "ios" ? 'apple' : 'google-play'}
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>{Platform.OS === "ios" ? i18n.t('aboutScreen.appstore') : i18n.t('aboutScreen.playstore')}</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.gitlab)}>
                            <Left>
                                <Icon active name="git"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>Gitlab</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.bugs)}>
                            <Left>
                                <Icon active name="bug"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>{i18n.t('aboutScreen.bugs')}</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.changelog)}>
                            <Left>
                                <Icon active name="refresh"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('aboutScreen.changelog')}
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.license)}>
                            <Left>
                                <Icon active name="file-document"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('aboutScreen.license')}
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.author')}</Text>
                        </CardItem>
                        <CardItem button
                        onPress={() => Alert.alert('Coucou', 'Whaou')}>
                            <Left>
                                <Icon active name="account-circle"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>Arnaud VERGNET</Text>
                            </Left>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.mail)}>
                            <Left>
                                <Icon active name="email"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('aboutScreen.mail')}
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.linkedin)}>
                            <Left>
                                <Icon active name="linkedin"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    Linkedin
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.facebook)}>
                            <Left>
                                <Icon active name="facebook"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    Facebook
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.technologies')}</Text>
                        </CardItem>
                        <CardItem button
                                  onPress={() => this.openWebLink(links.react)}>
                            <Left>
                                <Icon active name="react"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('aboutScreen.reactNative')}
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                        <CardItem button
                                  onPress={() => console.log('libs')}>
                            <Left>
                                <Icon active name="developer-board"
                                      type={'MaterialCommunityIcons'}
                                      style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('aboutScreen.libs')}
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
