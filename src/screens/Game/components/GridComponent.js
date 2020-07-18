// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {Cell} from "./CellComponent";
import CellComponent from "./CellComponent";

export type Grid = Array<Array<CellComponent>>;

type Props = {
    grid: Array<Array<Object>>,
    backgroundColor: string,
    height: number,
    width: number,
    containerMaxHeight: number | string,
    containerMaxWidth: number | string,
}

class GridComponent extends React.Component<Props> {

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

export default withTheme(GridComponent);
