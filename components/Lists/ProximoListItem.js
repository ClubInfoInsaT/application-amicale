// @flow

import * as React from 'react';
import {Avatar, List, Text, withTheme} from 'react-native-paper';
import i18n from "i18n-js";

type Props = {
    onPress: Function,
    color: string,
    item: Object,
}

class ProximoListItem extends React.PureComponent<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        return (
            <List.Item
                title={this.props.item.name}
                description={this.props.item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                descriptionStyle={{color: this.props.color}}
                onPress={this.props.onPress}
                left={() => <Avatar.Image style={{backgroundColor: 'transparent'}} size={64}
                                          source={{uri: this.props.item.image}}/>}
                right={() =>
                    <Text style={{fontWeight: "bold"}}>
                        {this.props.item.price}€
                    </Text>}
            />
        );
    }
}

export default withTheme(ProximoListItem);
