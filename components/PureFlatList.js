import * as React from 'react';
import {FlatList} from "react-native";


export default class PureFlatList extends React.PureComponent<Props>{

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
