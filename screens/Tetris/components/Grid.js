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
    containerHeight: number|string,
}

class Grid extends React.Component<Props>{

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getRow(rowNumber: number) {
        let cells = [];
        for (let i = 0; i < this.props.width; i++) {
            let cell = this.props.grid[rowNumber][i];
            let key = rowNumber + ':' + i;
            cells.push(<Cell color={cell.color} isEmpty={cell.isEmpty} id={key}/>);
        }
        return(
            <View style={{
                flexDirection: 'row',
            }}>
                {cells}
            </View>
        );
    }

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
                height: this.props.containerHeight,
                aspectRatio: this.props.width/this.props.height,
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: this.props.backgroundColor,
            }}>
                {this.getGrid()}
            </View>
        );
    }
}

export default withTheme(Grid);
