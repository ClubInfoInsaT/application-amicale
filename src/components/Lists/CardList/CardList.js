// @flow

import * as React from 'react';
import {Animated} from "react-native";
import ImageListItem from "./ImageListItem";
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
        if (this.props.isHorizontal)
            return <ImageListItem item={item} key={item.title}/>;
        else
            return <CardListItem item={item} key={item.title}/>;
    };

    keyExtractor = (item: cardItem) => item.title;

    render() {
        let containerStyle;
        if (this.props.isHorizontal) {
            containerStyle = {
                ...this.props.contentContainerStyle,
                height: 150,
                justifyContent: 'space-around',
            };
        } else {
            containerStyle = {
                ...this.props.contentContainerStyle,
            }
        }
        return (
            <Animated.FlatList
                {...this.props}
                data={this.props.dataset}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                numColumns={this.props.isHorizontal ? undefined : 2}
                horizontal={this.props.isHorizontal}
                contentContainerStyle={containerStyle}
            />
        );
    }
}