// @flow

import * as React from 'react';
import {FlatList, View} from "react-native";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import CustomModal from "../../components/Custom/CustomModal";
import {Button, List, Subheading, TextInput, Title, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
};

type State = {
    modalCurrentDisplayItem: Object,
    currentPreferences: Array<Object>,
}

/**
 * Class defining the Debug screen.
 * This screen allows the user to get and modify information on the app/device.
 */
class DebugScreen extends React.Component<Props, State> {

    modalRef: Object;
    modalInputValue = '';

    onModalRef: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.onModalRef = this.onModalRef.bind(this);
        this.colors = props.theme.colors;
        let copy = {...AsyncStorageManager.getInstance().preferences};
        let currentPreferences = [];
        Object.values(copy).map((object) => {
            currentPreferences.push(object);
        });
        this.state = {
            modalCurrentDisplayItem: {},
            currentPreferences: currentPreferences
        };
    }

    /**
     * Show the edit modal
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
        AsyncStorageManager.getInstance().savePref(key, value);
        this.modalRef.close();
    }

    /**
     * Callback used when receiving the modal ref
     *
     * @param ref
     */
    onModalRef(ref: Object) {
        this.modalRef = ref;
    }

    renderItem = ({item}: Object) => {
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
                <FlatList
                    data={this.state.currentPreferences}
                    extraData={this.state.currentPreferences}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

export default withTheme(DebugScreen);
