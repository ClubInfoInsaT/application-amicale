// @flow

import * as React from 'react';
import {Text, withTheme} from 'react-native-paper';
import {View} from "react-native-animatable";
import type {CustomTheme} from "../../managers/ThemeManager";
import Slider, {SliderProps} from "@react-native-community/slider";

type Props = {
    theme: CustomTheme,
    valueSuffix: string,
    ...SliderProps
}

type State = {
    currentValue: number,
}

/**
 * Abstraction layer for Modalize component, using custom configuration
 *
 * @param props Props to pass to the element. Must specify an onRef prop to get an Modalize ref.
 * @return {*}
 */
class CustomSlider extends React.Component<Props, State> {

    static defaultProps = {
        valueSuffix: "",
    }

    state = {
        currentValue: this.props.value,
    }

    onValueChange = (value: number) => {
        this.setState({currentValue: value});
        if (this.props.onValueChange != null)
            this.props.onValueChange(value);
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{marginHorizontal: 10, marginTop: 'auto', marginBottom: 'auto'}}>
                    {this.state.currentValue}min
                </Text>
                <Slider
                    {...this.props}
                    onValueChange={this.onValueChange}
                />
            </View>
        );
    }

}

export default withTheme(CustomSlider);

