// @flow

import * as React from 'react';
import {Image} from "react-native";
import {List, withTheme} from 'react-native-paper';
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {ServiceItem} from "../../../managers/ServicesManager";

type Props = {
    item: ServiceItem,
    isActive: boolean,
    height: number,
    onPress: () => void,
    theme: CustomTheme,
}

class DashboardEditItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.isActive !== this.props.isActive);
    }

    render() {
        return (
            <List.Item
                title={this.props.item.title}
                description={this.props.item.subtitle}
                onPress={this.props.isActive ? null : this.props.onPress}
                left={props =>
                    <Image
                        {...props}
                        source={{uri: this.props.item.image}}
                        style={{
                            width: 40,
                            height: 40
                        }}
                    />}
                right={props => this.props.isActive
                    ? <List.Icon
                        {...props}
                        icon={"check"}
                        color={this.props.theme.colors.success}
                    /> : null}
                style={{
                    height: this.props.height,
                    justifyContent: 'center',
                    paddingLeft: 30,
                    backgroundColor: this.props.isActive ? this.props.theme.colors.proxiwashFinishedColor : "transparent"
                }}
            />
        );
    }
}

export default withTheme(DashboardEditItem);
