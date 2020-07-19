// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {Cell} from "./CellComponent";
import CellComponent from "./CellComponent";
import type {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheet";

export type Grid = Array<Array<CellComponent>>;

type Props = {
    grid: Array<Array<Object>>,
    height: number,
    width: number,
    style: ViewStyle,
}

class GridComponent extends React.Component<Props> {

    getRow(rowNumber: number) {
        let cells = this.props.grid[rowNumber].map(this.getCellRender);
        return (
            <View
                style={{flexDirection: 'row',}}
                key={rowNumber.toString()}
            >
                {cells}
            </View>
        );
    }

    getCellRender = (item: Cell) => {
        return <CellComponent cell={item}/>;
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
                aspectRatio: this.props.width / this.props.height,
                borderRadius: 4,
                ...this.props.style
            }}>
                {this.getGrid()}
            </View>
        );
    }
}

export default withTheme(GridComponent);
