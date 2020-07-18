// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {Grid} from "./GridComponent";
import GridComponent from "./GridComponent";
import type {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheet";

type Props = {
    items: Array<Grid>,
    style: ViewStyle
}

class Preview extends React.PureComponent<Props> {

    getGrids() {
        let grids = [];
        for (let i = 0; i < this.props.items.length; i++) {
            grids.push(this.getGridRender(this.props.items[i], i));
        }
        return grids;
    }

    getGridRender(item: Grid, index: number) {
        return <GridComponent
            width={item[0].length}
            height={item.length}
            grid={item}
            style={{
                marginRight: 5,
                marginLeft: 5,
            }}
            key={index.toString()}
        />;
    };

    render() {
        if (this.props.items.length > 0) {
            return (
                <View style={this.props.style}>
                    {this.getGrids()}
                </View>
            );
        } else
            return null;
    }


}

export default withTheme(Preview);
