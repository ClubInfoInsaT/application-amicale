// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {FlatList, View} from "react-native";
import {stringMatchQuery} from "../../../utils/Search";
import GroupListItem from "./GroupListItem";
import AnimatedAccordion from "../../Animations/AnimatedAccordion";
import type {group, groupCategory} from "../../../screens/Planex/GroupSelectionScreen";
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    item: groupCategory,
    onGroupPress: (group) => void,
    onFavoritePress: (group) => void,
    currentSearchString: string,
    favoriteNumber: number,
    height: number,
    theme: CustomTheme,
}

const LIST_ITEM_HEIGHT = 64;

class GroupListAccordion extends React.Component<Props> {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.currentSearchString !== this.props.currentSearchString)
            || (nextProps.favoriteNumber !== this.props.favoriteNumber)
            || (nextProps.item.content.length !== this.props.item.content.length);
    }

    keyExtractor = (item: group) => item.id.toString();

    renderItem = ({item}: {item: group}) => {
        if (stringMatchQuery(item.name, this.props.currentSearchString)) {
            const onPress = () => this.props.onGroupPress(item);
            const onStarPress = () => this.props.onFavoritePress(item);
            return (
                <GroupListItem
                    height={LIST_ITEM_HEIGHT}
                    item={item}
                    onPress={onPress}
                    onStarPress={onStarPress}/>
            );
        } else
            return null;
    }

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
                        item.id === 0
                            ? <List.Icon
                                {...props}
                                icon={"star"}
                                color={this.props.theme.colors.tetrisScore}
                            />
                            : null}
                    unmountWhenCollapsed={true}// Only render list if expanded for increased performance
                    opened={this.props.item.id === 0 || this.props.currentSearchString.length > 0}
                >
                    {/*$FlowFixMe*/}
                    <FlatList
                        data={item.content}
                        extraData={this.props.currentSearchString}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        listKey={item.id.toString()}
                        // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
                        // getItemLayout={this.itemLayout} // Broken with search
                        // removeClippedSubviews={true}
                    />
                </AnimatedAccordion>
            </View>
        );
    }
}

export default withTheme(GroupListAccordion)