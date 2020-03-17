// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import Grid from "./Grid";

type Props = {
    next: Object,
}

class Preview extends React.PureComponent<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getGrids() {
        let grids = [];
        for (let i = 0; i < this.props.next.length; i++) {
            grids.push(
                <Grid
                    width={this.props.next[i][0].length}
                    height={this.props.next[i].length}
                    grid={this.props.next[i]}
                    containerHeight={50}
                    backgroundColor={'transparent'}
                />
            );
        }
        return grids;
    }

    render() {
        if (this.props.next.length > 0) {
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
