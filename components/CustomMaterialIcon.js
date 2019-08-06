// @flow

import * as React from 'react';
import {Icon} from "native-base";
import ThemeManager from '../utils/ThemeManager';

type Props = {
    active: boolean,
    icon: string,
    color: ?string,
    fontSize: number,
    width: number | string,
}

/**
 * Custom component defining a material icon using native base
 *
 * @prop active {boolean} Whether to set the icon color to active
 * @prop icon {string} The icon string to use from MaterialCommunityIcons
 * @prop color {string} The icon color. Use default theme color if unspecified
 * @prop fontSize {number} The icon size. Use 26 if unspecified
 * @prop width {number} The icon width. Use 30 if unspecified
 */
export default class CustomMaterialIcon extends React.Component<Props> {

    static defaultProps = {
        active: false,
        color: undefined,
        fontSize: 26,
        width: 30,
    };

    render() {
        return (
            <Icon
                active
                name={this.props.icon}
                type={'MaterialCommunityIcons'}
                style={{
                    color:
                        this.props.color !== undefined ?
                            this.props.color :
                            this.props.active ?
                                ThemeManager.getCurrentThemeVariables().brandPrimary :
                                ThemeManager.getCurrentThemeVariables().customMaterialIconColor,
                    fontSize: this.props.fontSize,
                    width: this.props.width
                }}
            />
        );
    }
}
