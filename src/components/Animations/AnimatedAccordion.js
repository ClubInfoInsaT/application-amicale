// @flow

import * as React from 'react';
import {View} from "react-native";
import {List, withTheme} from 'react-native-paper';
import Collapsible from "react-native-collapsible";
import * as Animatable from "react-native-animatable";
import type {CustomTheme} from "../../managers/ThemeManager";

type Props = {
    theme: CustomTheme,
    title: string,
    subtitle?: string,
    left?: (props: { [keys: string]: any }) =>  React.Node,
    startOpen: boolean,
    keepOpen: boolean,
    unmountWhenCollapsed: boolean,
    children?: React.Node,
}

type State = {
    expanded: boolean
}

const AnimatedListIcon = Animatable.createAnimatableComponent(List.Icon);

class AnimatedAccordion extends React.PureComponent<Props, State> {

    static defaultProps = {
        startOpen: false,
        keepOpen: false,
        unmountWhenCollapsed: false,
    }
    chevronRef: { current: null | AnimatedListIcon };
    state = {
        expanded: false,
    }

    constructor(props) {
        super(props);
        this.chevronRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.startOpen)
            this.toggleAccordion();
    }

    toggleAccordion = () => {
        if (!this.props.keepOpen) {
            if (this.chevronRef.current != null)
                this.chevronRef.current.transitionTo({rotate: this.state.expanded ? '0deg' : '180deg'});
            this.setState({expanded: !this.state.expanded})
        }
    };

    render() {
        const colors = this.props.theme.colors;
        return (
            <View>
                <List.Item
                    {...this.props}
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    titleStyle={this.state.expanded ? {color: colors.primary} : undefined}
                    onPress={this.toggleAccordion}
                    right={(props) => <AnimatedListIcon
                        ref={this.chevronRef}
                        {...props}
                        icon={"chevron-down"}
                        color={this.state.expanded ? colors.primary : undefined}
                        useNativeDriver
                    />}
                    left={this.props.left}
                />
                <Collapsible collapsed={!this.props.keepOpen && !this.state.expanded}>
                    {!this.props.unmountWhenCollapsed || (this.props.unmountWhenCollapsed && this.state.expanded)
                        ? this.props.children
                        : null}
                </Collapsible>
            </View>
        );
    }

}

export default withTheme(AnimatedAccordion);