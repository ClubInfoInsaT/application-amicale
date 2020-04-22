// @flow

import * as React from 'react';
import {Caption, Card, Paragraph} from 'react-native-paper';
import type {cardItem} from "./CardList";

type Props = {
    width: string | number,
    item: cardItem,
}

export default class CardListItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const props = this.props;
        const item = props.item;
        const source = typeof item.image === "number"
            ? item.image
            : {uri: item.image};
        return (
            <Card
                style={{
                    width: props.width,
                    margin: 5,
                }}
                onPress={item.onPress}
            >
                <Card.Cover
                    style={{height: 80}}
                    source={source}
                />
                <Card.Content>
                    <Paragraph>{item.title}</Paragraph>
                    <Caption>{item.subtitle}</Caption>
                </Card.Content>
            </Card>
        );
    }
}