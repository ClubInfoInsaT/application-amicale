// @flow

import * as React from 'react';
import {Icon} from "native-base";
import ThemeManager from '../utils/ThemeManager';

type Props = {
    active: boolean,
    icon: string,
    color: ?string,
    fontSize: number,
    width: number,
}

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
                                ThemeManager.getInstance().getCurrentThemeVariables().brandPrimary :
                                ThemeManager.getInstance().getCurrentThemeVariables().customMaterialIconColor,
                    fontSize: this.props.fontSize,
                    width: this.props.width
                }}
            />
        );
    }
}
