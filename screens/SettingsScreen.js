import React from 'react';
import {Container, Content, Left, ListItem, Right, Text, List, CheckBox, Button} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import {NavigationActions, StackActions} from "react-navigation";
import CustomMaterialIcon from "../components/CustomMaterialIcon";


const nightModeKey = 'nightMode';

export default class SettingsScreen extends React.Component {
    state = {
        nightMode: ThemeManager.getInstance().getNightMode(),
    };

    toggleNightMode() {
        this.setState({nightMode: !this.state.nightMode});
        ThemeManager.getInstance().setNightmode(!this.state.nightMode);
        // Alert.alert(i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.restart'));
        this.resetStack();
    }

    resetStack() {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('Settings');
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
                                <CustomMaterialIcon icon={'theme-light-dark'} />
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
