import React from 'react';
import {Icon} from "native-base";
import ThemeManager from '../utils/ThemeManager';

export default class CustomMaterialIcon extends React.Component {

    constructor(props) {
        super(props);
    }

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
                    fontSize: this.props.fontSize !== undefined ? this.props.fontSize : 26,
                    width: this.props.width !== undefined ? this.props.width : 30
                }}
            />
        );
    }
}
