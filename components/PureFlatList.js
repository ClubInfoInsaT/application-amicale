import * as React from 'react';
import {FlatList} from "react-native";

type Props = {
    data: Array<Object>,
    keyExtractor: Function,
    renderItem: Function,
    updateData: number,
}

/**
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
export default class PureFlatList extends React.PureComponent<Props>{

    static defaultProps = {
        updateData: null,
    };

    render() {
        return (
            <FlatList
                data={this.props.data}
                keyExtractor={this.props.keyExtractor}
                style={{minHeight: 300, width: '100%'}}
                renderItem={this.props.renderItem}
            />
        );
    }
}
