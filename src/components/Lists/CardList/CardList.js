// @flow

import * as React from 'react';
import {Animated, Dimensions} from "react-native";
import ImageListItem from "./ImageListItem";
import CardListItem from "./CardListItem";
import type {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheet";

type Props = {
    dataset: Array<cardItem>,
    isHorizontal: boolean,
    contentContainerStyle?: ViewStyle,
}

export type cardItem = {
    key: string,
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

    windowWidth: number;
    horizontalItemSize: number;

    constructor(props: Props) {
        super(props);
        this.windowWidth = Dimensions.get('window').width;
        this.horizontalItemSize = this.windowWidth/4; // So that we can fit 3 items and a part of the 4th => user knows he can scroll
    }

    renderItem = ({item}: { item: cardItem }) => {
        if (this.props.isHorizontal)
            return <ImageListItem item={item} key={item.title} width={this.horizontalItemSize}/>;
        else
            return <CardListItem item={item} key={item.title}/>;
    };

    keyExtractor = (item: cardItem) => item.key;

    render() {
        let containerStyle = {};
        if (this.props.isHorizontal) {
            containerStyle = {
                height: this.horizontalItemSize + 50,
                justifyContent: 'space-around',
            };
        }
        return (
            <Animated.FlatList
                {...this.props}
                data={this.props.dataset}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                numColumns={this.props.isHorizontal ? undefined : 2}
                horizontal={this.props.isHorizontal}
                contentContainerStyle={this.props.isHorizontal ? containerStyle : this.props.contentContainerStyle}
                pagingEnabled={this.props.isHorizontal}
                snapToInterval={this.props.isHorizontal ? (this.horizontalItemSize+5)*3 : null}
            />
        );
    }
}
