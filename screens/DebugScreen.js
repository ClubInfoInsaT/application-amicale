// @flow

import * as React from 'react';
import {
    Body,
    Card,
    CardItem,
    Container,
    Content,
    H1,
    H3,
    Left,
    List,
    ListItem,
    Right,
    Text,
    Form,
    Item,
    Label,
    Input,
    Button
} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import Touchable from "react-native-platform-touchable";
import {Alert, View, Clipboard, Image} from "react-native";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import NotificationsManager from "../utils/NotificationsManager";
import Modalize from "react-native-modalize";

type Props = {
    navigation: Object,
};

type State = {
    modalCurrentDisplayItem: Object,
    currentPreferences: Object,
}

/**
 * Class defining the Debug screen. This screen allows the user to get detailed information on the app/device.
 */
export default class DebugScreen extends React.Component<Props, State> {

    modalRef: { current: null | Modalize };
    modalInputValue = '';

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
    }

    state = {
        modalCurrentDisplayItem: {},
        currentPreferences: JSON.parse(JSON.stringify(AsyncStorageManager.getInstance().preferences))
    };

    alertCurrentExpoToken() {
        let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
        console.log(token);
        Alert.alert(
            'Expo Token',
            token,
            [
                {text: 'Copy', onPress: () => Clipboard.setString(token)},
                {text: 'OK'}
            ]
        );
    }

    async forceExpoTokenUpdate() {
        await NotificationsManager.forceExpoTokenUpdate();
        this.alertCurrentExpoToken();
    }


    static getGeneralItem(onPressCallback: Function, icon: ?string, title: string, subtitle: string) {
        return (
            <ListItem
                button
                thumbnail
                onPress={onPressCallback}
            >
                {icon !== undefined ?
                    <Left>
                        <CustomMaterialIcon icon={icon}/>
                    </Left>
                    : <View/>
                }
                <Body>
                    <Text>
                        {title}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>
                <Right/>
            </ListItem>
        );
    }

    showEditModal(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <H1>{this.state.modalCurrentDisplayItem.key}</H1>
                <H3>Default: {this.state.modalCurrentDisplayItem.default}</H3>
                <H3>Current: {this.state.modalCurrentDisplayItem.current}</H3>
                <Form>
                    <Item floatingLabel>
                        <Label>New Value</Label>
                        <Input onChangeText={(text) => this.modalInputValue = text}/>
                    </Item>
                </Form>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                }}>
                    <Button success
                            onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.modalInputValue)}>
                        <Text>Save new value</Text>
                    </Button>
                    <Button
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.state.modalCurrentDisplayItem.default)}>
                        <Text>Reset to default</Text>
                    </Button>
                </View>

            </View>
        );
    }

    saveNewPrefs(key: string, value: string) {
        this.setState((prevState) => {
            let currentPreferences = {...prevState.currentPreferences};
            currentPreferences[key].current = value;
            return {currentPreferences};
        });
        AsyncStorageManager.getInstance().savePref(key, value);
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <Modalize
                    ref={this.modalRef}
                    adjustToContentHeight
                    modalStyle={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                    {this.getModalContent()}
                </Modalize>
                <CustomHeader navigation={nav} title={i18n.t('screens.debug')} hasBackButton={true}/>
                <Content padder>
                    <Card>
                        <CardItem header>
                            <Text>
                                Notifications
                            </Text>
                        </CardItem>
                        <List>
                            {DebugScreen.getGeneralItem(() => this.alertCurrentExpoToken(), 'bell', 'Get current Expo Token', '')}
                            {DebugScreen.getGeneralItem(() => this.forceExpoTokenUpdate(), 'bell-ring', 'Force Expo token update', '')}
                        </List>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Text>
                                Preferences
                            </Text>
                        </CardItem>
                        <List>
                            {Object.values(this.state.currentPreferences).map((object) =>
                                <View>
                                    {DebugScreen.getGeneralItem(() => this.showEditModal(object), undefined, object.key, 'Click to edit')}
                                </View>
                            )}
                        </List>
                    </Card>
                </Content>
            </Container>

        );
    }
}
