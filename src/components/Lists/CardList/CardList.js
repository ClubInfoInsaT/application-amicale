// @flow

import * as React from 'react';
import {Animated} from "react-native";
import CardListItem from "./CardListItem";

type Props = {
    dataset: Array<cardItem>,
    isHorizontal: boolean,
}

export type cardItem = {
    title: string,
    subtitle: string,
    image: string | number,
    onPress: () => void,
};

export type cardList = Array<cardItem>;


export default class CardList extends React.Component<Props> {

    static defaultProps = {
        isHorizontal: false,
    }

    renderItem = ({item}: { item: cardItem }) => {
        return (
            <CardListItem item={item} key={item.title}/>
        );
    };

    keyExtractor = (item: cardItem) => item.title;

    render() {
        let containerStyle = {
            ...this.props.contentContainerStyle,
            height: 150,
            justifyContent: 'space-around',
        };
        if (!this.props.isHorizontal) {
            containerStyle = {
                ...containerStyle,
                marginLeft: 'auto',
                marginRight: 'auto',
                height: 'auto',
            }
        }
        return (
            <Animated.FlatList
                {...this.props}
                data={this.props.dataset}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                numColumns={this.props.isHorizontal ? undefined : 3}
                horizontal={this.props.isHorizontal}
                contentContainerStyle={containerStyle}
            />
        );
    }
}