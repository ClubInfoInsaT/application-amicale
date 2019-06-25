import React from 'react';
import {Alert} from 'react-native'
import {Badge, Container, Content, Icon, Left, ListItem, Right, Text, List, CheckBox} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";


const nightModeKey = 'nightMode';

export default class SettingsScreen extends React.Component {
    state = {
        nightMode: ThemeManager.getInstance().getNightMode(),
    };

    toggleNightMode() {
        this.setState({nightMode: !this.state.nightMode});
        ThemeManager.getInstance().setNightmode(!this.state.nightMode);
        Alert.alert(i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.restart'));

    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.settings')}/>
                <Content>
                    <List>
                        <ListItem
                            button
                            onPress={() => this.toggleNightMode()}
                        >
                            <Left>
                                <Icon
                                    active
                                    name={'theme-light-dark'}
                                    type={'MaterialCommunityIcons'}
                                    style={{color: "#777", fontSize: 26, width: 30}}
                                />
                                <Text>
                                    {i18n.t('settingsScreen.nightMode')}
                                </Text>
                            </Left>
                            <Right style={{flex: 1}}>
                                <CheckBox checked={this.state.nightMode}
                                          onPress={() => this.toggleNightMode()}/>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>

        );
    }
}
