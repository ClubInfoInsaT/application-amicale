// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {FlatList, View} from "react-native";
import {stringMatchQuery} from "../../../utils/Search";
import * as Animatable from "react-native-animatable";
import GroupListItem from "./GroupListItem";
import AnimatedAccordion from "../../Animations/AnimatedAccordion";

type Props = {
    item: Object,
    onGroupPress: Function,
    onFavoritePress: Function,
    currentSearchString: string,
    favoriteNumber: number,
    height: number,
    theme: Object,
}

type State = {
    expanded: boolean,
}

const LIST_ITEM_HEIGHT = 64;
const AnimatedListIcon = Animatable.createAnimatableComponent(List.Icon);

class GroupListAccordion extends React.Component<Props, State> {

    chevronRef: Object;

    constructor(props) {
        super(props);
        this.state = {
            expanded: props.item.id === "0",
        }
        this.chevronRef = React.createRef();
    }

    shouldComponentUpdate(nextProps: Props, nextSate: State) {
        if (nextProps.currentSearchString !== this.props.currentSearchString)
            this.state.expanded = nextProps.currentSearchString.length > 0;

        return (nextProps.currentSearchString !== this.props.currentSearchString)
            || (nextSate.expanded !== this.state.expanded)
            || (nextProps.favoriteNumber !== this.props.favoriteNumber)
            || (nextProps.item.content.length !== this.props.item.content.length);
    }

    keyExtractor = (item: Object) => item.id.toString();

    renderItem = ({item}: Object) => {
        if (stringMatchQuery(item.name, this.props.currentSearchString)) {
            const onPress = () => this.props.onGroupPress(item);
            const onStartPress = () => this.props.onFavoritePress(item);
            return (
                <GroupListItem
                    height={LIST_ITEM_HEIGHT}
                    item={item}
                    onPress={onPress}
                    onStartPress={onStartPress}/>
            );
        } else
            return null;
    }

    itemLayout = (data: Object, index: number) => ({length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index});

    render() {
        const item = this.props.item;
        return (
            <View>
                <AnimatedAccordion
                    title={item.name}
                    style={{
                        height: this.props.height,
                        justifyContent: 'center',
                    }}
                    left={props =>
                        item.id === "0"
                            ? <List.Icon
                                {...props}
                                icon={"star"}
                                color={this.props.theme.colors.tetrisScore}
                            />
                            : null}
                    unmountWhenCollapsed={true}// Only render list if expanded for increased performance
                >
                    <FlatList
                        data={item.content}
                        extraData={this.props.currentSearchString}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        listKey={item.id}
                        // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                        getItemLayout={this.itemLayout} // Broken with search
                        removeClippedSubviews={true}
                    />
                </AnimatedAccordion>
            </View>
        );
    }
}

export default withTheme(GroupListAccordion)