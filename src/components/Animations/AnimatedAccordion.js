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
    opened?: boolean,
    unmountWhenCollapsed: boolean,
    children?: React.Node,
}

type State = {
    expanded: boolean
}

const AnimatedListIcon = Animatable.createAnimatableComponent(List.Icon);

class AnimatedAccordion extends React.Component<Props, State> {

    static defaultProps = {
        unmountWhenCollapsed: false,
    }
    chevronRef: { current: null | AnimatedListIcon };
    chevronIcon: string;
    animStart: string;
    animEnd: string;

    state = {
        expanded: this.props.opened != null ? this.props.opened : false,
    }

    constructor(props) {
        super(props);
        this.chevronRef = React.createRef();
        this.setupChevron();
    }

    setupChevron() {
        if (this.state.expanded) {
            this.chevronIcon = "chevron-up";
            this.animStart = "180deg";
            this.animEnd = "0deg";
        } else {
            this.chevronIcon = "chevron-down";
            this.animStart = "0deg";
            this.animEnd = "180deg";
        }
    }

    toggleAccordion = () => {
        if (this.chevronRef.current != null)
            this.chevronRef.current.transitionTo({rotate: this.state.expanded ? this.animStart : this.animEnd});
        this.setState({expanded: !this.state.expanded})
    };

    shouldComponentUpdate(nextProps: Props) {
        if (nextProps.opened != null)
            this.state.expanded = nextProps.opened;
        this.setupChevron();
        return true;
    }

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
                        icon={this.chevronIcon}
                        color={this.state.expanded ? colors.primary : undefined}
                        useNativeDriver
                    />}
                    left={this.props.left}
                />
                <Collapsible collapsed={!this.state.expanded}>
                    {!this.props.unmountWhenCollapsed || (this.props.unmountWhenCollapsed && this.state.expanded)
                        ? this.props.children
                        : null}
                </Collapsible>
            </View>
        );
    }

}

export default withTheme(AnimatedAccordion);