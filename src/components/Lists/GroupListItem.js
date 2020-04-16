// @flow

import * as React from 'react';
import {IconButton, List, withTheme} from 'react-native-paper';

type Props = {
    theme: Object,
    onPress: Function,
    onStartPress: Function,
    item: Object,
    height: number,
}

type State = {
    isFav: boolean,
}

class GroupListItem extends React.Component<Props, State> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.state = {
            isFav: (props.item.isFav !== undefined && props.item.isFav),
        }
    }

    shouldComponentUpdate(prevProps: Props, prevState: State) {
        return (prevState.isFav !== this.state.isFav);
    }

    onStarPress = () => {
        this.setState({isFav: !this.state.isFav});
        this.props.onStartPress();
    }

    render() {
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
                            ? this.props.theme.colors.tetrisScore
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
