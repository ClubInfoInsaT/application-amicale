// @flow

import * as React from 'react';
import {View} from "react-native";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import CustomModal from "../../components/Overrides/CustomModal";
import {Button, List, Subheading, TextInput, Title, withTheme} from 'react-native-paper';
import {StackNavigationProp} from "@react-navigation/stack";
import {Modalize} from "react-native-modalize";
import type {CustomTheme} from "../../managers/ThemeManager";
import CollapsibleFlatList from "../../components/Collapsible/CollapsibleFlatList";

type PreferenceItem = {
    key: string,
    default: string,
    current: string,
}

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme
};

type State = {
    modalCurrentDisplayItem: PreferenceItem,
    currentPreferences: Array<PreferenceItem>,
}

/**
 * Class defining the Debug screen.
 * This screen allows the user to get and modify information on the app/device.
 */
class DebugScreen extends React.Component<Props, State> {

    modalRef: Modalize;
    modalInputValue: string;

    /**
     * Copies user preferences to state for easier manipulation
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.modalInputValue = "";
        let currentPreferences : Array<PreferenceItem> = [];
        Object.values(AsyncStorageManager.PREFERENCES).map((object: any) => {
            let newObject: PreferenceItem = {...object};
            newObject.current = AsyncStorageManager.getString(newObject.key);
            currentPreferences.push(newObject);
        });
        this.state = {
            modalCurrentDisplayItem: {},
            currentPreferences: currentPreferences
        };
    }

    /**
     * Shows the edit modal
     *
     * @param item
     */
    showEditModal(item: PreferenceItem) {
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
                        color={this.props.theme.colors.success}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.modalInputValue)}>
                        Save new value
                    </Button>
                    <Button
                        mode="contained"
                        dark={true}
                        color={this.props.theme.colors.danger}
                        onPress={() => this.saveNewPrefs(this.state.modalCurrentDisplayItem.key, this.state.modalCurrentDisplayItem.default)}>
                        Reset to default
                    </Button>
                </View>

            </View>
        );
    }

    /**
     * Finds the index of the given key in the preferences array
     *
     * @param key THe key to find the index of
     * @returns {number}
     */
    findIndexOfKey(key: string) {
        let index = -1;
        for (let i = 0; i < this.state.currentPreferences.length; i++) {
            if (this.state.currentPreferences[i].key === key) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * Saves the new value of the given preference
     *
     * @param key The pref key
     * @param value The pref value
     */
    saveNewPrefs(key: string, value: string) {
        this.setState((prevState) => {
            let currentPreferences = [...prevState.currentPreferences];
            currentPreferences[this.findIndexOfKey(key)].current = value;
            return {currentPreferences};
        });
        AsyncStorageManager.set(key, value);
        this.modalRef.close();
    }

    /**
     * Callback used when receiving the modal ref
     *
     * @param ref
     */
    onModalRef = (ref: Modalize) => {
        this.modalRef = ref;
    }

    renderItem = ({item}: {item: PreferenceItem}) => {
        return (
            <List.Item
                title={item.key}
                description={'Click to edit'}
                onPress={() => this.showEditModal(item)}
            />
        );
    };

    render() {
        return (
            <View>
                <CustomModal onRef={this.onModalRef}>
                    {this.getModalContent()}
                </CustomModal>
                {/*$FlowFixMe*/}
                <CollapsibleFlatList
                    data={this.state.currentPreferences}
                    extraData={this.state.currentPreferences}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

export default withTheme(DebugScreen);
