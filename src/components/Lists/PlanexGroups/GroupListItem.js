// @flow

import * as React from 'react';
import {IconButton, List, withTheme} from 'react-native-paper';
import type {CustomTheme} from "../../../managers/ThemeManager";
import type {group} from "../../../screens/Planex/GroupSelectionScreen";

type Props = {
    theme: CustomTheme,
    onPress: () => void,
    onStarPress: () => void,
    item: group,
    height: number,
}

type State = {
    isFav: boolean,
}

class GroupListItem extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            isFav: (props.item.isFav !== undefined && props.item.isFav),
        }
    }

    shouldComponentUpdate(prevProps: Props, prevState: State) {
        return (prevState.isFav !== this.state.isFav);
    }

    onStarPress = () => {
        this.setState({isFav: !this.state.isFav});
        this.props.onStarPress();
    }

    render() {
        const colors = this.props.theme.colors;
        return (
            <List.Item
                title={this.props.item.name}
                onPress={this.props.onPress}
                left={props =>
                    <List.Icon
                        {...props}
                        icon={"chevron-right"}/>}
                right={props =>
                    <IconButton
                        {...props}
                        icon={"star"}
                        onPress={this.onStarPress}
                        color={this.state.isFav
                            ? colors.tetrisScore
                            : props.color}
                    />}
                style={{
                    height: this.props.height,
                    justifyContent: 'center',
                }}
            />
        );
    }
}

export default withTheme(GroupListItem);
