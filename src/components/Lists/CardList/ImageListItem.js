// @flow

import * as React from 'react';
import {Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import type {cardItem} from "./CardList";

type Props = {
    item: cardItem,
    width: number,
}

export default class ImageListItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const item = this.props.item;
        const source = typeof item.image === "number"
            ? item.image
            : {uri: item.image};
        return (
            <TouchableRipple
                style={{
                    width: this.props.width,
                    height: this.props.width + 40,
                    margin: 5,
                }}
                onPress={item.onPress}
            >
                <View>
                    <Image
                        style={{
                            width: this.props.width - 20,
                            height: this.props.width - 20,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        source={source}
                    />
                    <Text style={{
                        marginTop: 5,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center'
                    }}>
                        {item.title}
                    </Text>
                </View>
            </TouchableRipple>
        );
    }
}
