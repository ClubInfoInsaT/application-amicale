// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import Cell from "./Cell";

type Props = {
    navigation: Object,
    grid: Array<Array<Object>>,
    backgroundColor: string,
    height: number,
    width: number,
    containerMaxHeight: number | string,
    containerMaxWidth: number | string,
}

class Grid extends React.Component<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getRow(rowNumber: number) {
        let cells = this.props.grid[rowNumber].map(this.getCellRender);
        return (
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: this.props.backgroundColor,
                }}
                key={rowNumber.toString()}
            >
                {cells}
            </View>
        );
    }

    getCellRender = (item: Object) => {
        return <Cell item={item} key={item.key}/>;
    };

    getGrid() {
        let rows = [];
        for (let i = 0; i < this.props.height; i++) {
            rows.push(this.getRow(i));
        }
        return rows;
    }

    render() {
        return (
            <View style={{
                flexDirection: 'column',
                maxWidth: this.props.containerMaxWidth,
                maxHeight: this.props.containerMaxHeight,
                aspectRatio: this.props.width / this.props.height,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                {this.getGrid()}
            </View>
        );
    }
}

export default withTheme(Grid);
