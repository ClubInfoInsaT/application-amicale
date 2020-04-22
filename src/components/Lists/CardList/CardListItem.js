// @flow

import * as React from 'react';
import {Caption, Card, Paragraph} from 'react-native-paper';
import type {cardItem} from "./CardList";

type Props = {
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
                    width: '40%',
                    margin: 5,
                    marginLeft: 'auto',
                    marginRight: 'auto',
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