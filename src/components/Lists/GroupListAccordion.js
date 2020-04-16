// @flow

import * as React from 'react';
import {List} from 'react-native-paper';
import {FlatList} from "react-native";
import {stringMatchQuery} from "../../utils/Search";

type Props = {
    item: Object,
    onGroupPress: Function,
    currentSearchString: string,
    height: number,
}

type State = {
    expanded: boolean,
}

const LIST_ITEM_HEIGHT = 64;

export default class GroupListAccordion extends React.Component<Props, State> {

    state = {
        expanded: false,
    }

    shouldComponentUpdate(nextProps: Props, nextSate: State) {
        if (nextProps.currentSearchString !== this.props.currentSearchString)
            this.state.expanded = nextProps.currentSearchString.length > 0;

        return (nextProps.currentSearchString !== this.props.currentSearchString)
            || (nextSate.expanded !== this.state.expanded);
    }

    onPress = () => this.setState({expanded: !this.state.expanded});

    keyExtractor = (item: Object) => item.id.toString();

    renderItem = ({item}: Object) => {
        if (stringMatchQuery(item.name, this.props.currentSearchString)) {
            const onPress = () => this.props.onGroupPress(item);
            return (
                <List.Item
                    title={item.name}
                    onPress={onPress}
                    left={props =>
                        <List.Icon
                            {...props}
                            icon={"chevron-right"}/>}
                    right={props =>
                        <List.Icon
                            {...props}
                            icon={"star"}/>}
                    style={{
                        height: LIST_ITEM_HEIGHT,
                        justifyContent: 'center',
                    }}
                />
            );
        } else
            return null;
    }

    itemLayout = (data: Object, index: number) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        const item = this.props.item;
        return (
            <List.Accordion
                title={item.name}
                expanded={this.state.expanded}
                onPress={this.onPress}
                style={{
                    height: this.props.height,
                    justifyContent: 'center',
                }}
            >
                {/*$FlowFixMe*/}
                <FlatList
                    data={item.content}
                    extraData={this.props.currentSearchString}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    listKey={item.id}
                    // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                    getItemLayout={this.itemLayout}
                    removeClippedSubviews={true}
                />
            </List.Accordion>
        );
    }
}