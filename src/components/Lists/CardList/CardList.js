// @flow

import * as React from 'react';
import {Animated, View} from "react-native";
import CardListItem from "./CardListItem";

type Props = {
    dataset: Array<cards>
}

export type cardItem = {
    title: string,
    subtitle: string,
    image: string | number,
    onPress: () => void,
};

export type cards = Array<cardItem>;


export default class CardList extends React.Component<Props> {

    renderItem = ({item}: { item: cards }) => {
        let width = '80%';
        if (item.length > 1) {
            width = '40%';
        }
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: "space-evenly",
                marginTop: 10,
            }}>
                {item.map((card: cardItem, index: number) => {
                    return (
                        <CardListItem width={width} item={card} key={index.toString()}/>
                    );
                })}
            </View>
        );
    };

    keyExtractor = (item: cards) => item[0].title;

    render() {
        return (
            <Animated.FlatList
                {...this.props}
                data={this.props.dataset}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        );
    }
}