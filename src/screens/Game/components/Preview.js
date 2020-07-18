// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {Grid} from "./GridComponent";
import GridComponent from "./GridComponent";

type Props = {
    items: Array<Grid>,
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
            containerMaxHeight={50}
            containerMaxWidth={50}
            backgroundColor={'transparent'}
            key={index.toString()}
        />;
    };

    render() {
        if (this.props.items.length > 0) {
            return (
                <View>
                    {this.getGrids()}
                </View>
            );
        } else
            return null;
    }


}

export default withTheme(Preview);
