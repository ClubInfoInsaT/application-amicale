// @flow

import * as React from 'react';
import {ScrollView, View} from "react-native";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import CustomModal from "../../components/Custom/CustomModal";
import {Button, Card, List, Subheading, TextInput, Title, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
};

type State = {
    modalCurrentDisplayItem: Object,
    currentPreferences: Object,
}

/**
 * Class defining the Debug screen.
 * This screen allows the user to get and modify information on the app/device.
 */
class DebugScreen extends React.Component<Props, State> {

    modalRef: Object;
    modalInputValue = '';
    state = {
        modalCurrentDisplayItem: {},
        currentPreferences: JSON.parse(JSON.stringify(AsyncStorageManager.getInstance().preferences))
    };

    onModalRef: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.onModalRef = this.onModalRef.bind(this);
        this.colors = props.theme.colors;
    }

    /**
     * Gets a clickable list item
     *
     * @param onPressCallback The function to call when clicking on the item
     * @param icon The item's icon
     * @param title The item's title
     * @param subtitle The item's subtitle
     * @return {*}
     */
    static getGeneralItem(onPressCallback: Function, icon: ?string, title: string, subtitle: string) {
        if (icon !== undefined) {
            return (
                <List.Item
                    title={title}
                    description={subtitle}
                    left={() => <List.Icon icon={icon}/>}
                    onPress={onPressCallback}
                />
            );
        } else {
            return (
                <List.Item
                    title={title}
                    description={subtitle}
                    onPress={onPressCallback}
                />
            );
        }
    }

    /**
     * Show the
     * @param item
     */
    showEditModal(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef) {
            this.modalRef.open();
        }
    }

    /**
     * Gets the edit modal content
     *
     * @return {*}
     */
    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <Title>{this.state.modalCurrentDisplayItem.key}</Title>
                <Subheading>Default: {this.state.modalCurrentDisplayItem.default}</Subheading>
                <Subheading>Current: {this.state.modalCurrentDisplayItem.current}</Subheading>
                <TextInput
                    label='New Value'
                    onChangeText={(text) => this.modalInputValue = text}
                />
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                }}>
                    <Button
                        mode="contained"
                        dark={true}
                        color={this.colors.success}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.modalInputValue)}>
                        Save new value
                    </Button>
                    <Button
                        mode="contained"
                        dark={true}
                        color={this.colors.danger}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.state.modalCurrentDisplayItem.default)}>
                        Reset to default
                    </Button>
                </View>

            </View>
        );
    }

    /**
     * Saves the new value of the given preference
     *
     * @param key The pref key
     * @param value The pref value
     */
    saveNewPrefs(key: string, value: string) {
        this.setState((prevState) => {
            let currentPreferences = {...prevState.currentPreferences};
            currentPreferences[key].current = value;
            return {currentPreferences};
        });
        AsyncStorageManager.getInstance().savePref(key, value);
    }

    /**
     * Callback used when receiving the modal ref
     *
     * @param ref
     */
    onModalRef(ref: Object) {
        this.modalRef = ref;
    }

    render() {
        return (
            <View>
                <CustomModal onRef={this.onModalRef}>
                    {this.getModalContent()}
                </CustomModal>
                <ScrollView style={{padding: 5}}>
                    <Card style={{margin: 5}}>
                        <Card.Title
                            title={'Preferences'}
                        />
                        <Card.Content>
                            {Object.values(this.state.currentPreferences).map((object) =>
                                <View>
                                    {DebugScreen.getGeneralItem(
                                        () => this.showEditModal(object),
                                        undefined,
                                        //$FlowFixMe
                                        object.key,
                                        'Click to edit')}
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

export default withTheme(DebugScreen);
