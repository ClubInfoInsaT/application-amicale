// @flow

import * as React from 'react';
import {Avatar, List, withTheme} from 'react-native-paper';
import {View} from "react-native";

type Props = {
    onPress: Function,
    categoryTranslator: Function,
    chipRender: Function,
    item: Object,
}

class ClubListItem extends React.PureComponent<Props> {

    colors: Object;
    hasManagers: boolean;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.hasManagers = props.item.responsibles.length > 0;
    }

    getCategoriesRender(categories: Array<number | null>) {
        let final = [];
        for (let i = 0; i < categories.length; i++) {
            if (categories[i] !== null){
                const category = this.props.categoryTranslator(categories[i]);
                final.push(this.props.chipRender(category, this.props.item.id + ':' + category.id));
            }
        }
        return <View style={{flexDirection: 'row'}}>{final}</View>;
    }

    render() {
        const categoriesRender = this.getCategoriesRender.bind(this, this.props.item.category);
        return (
            <List.Item
                title={this.props.item.name}
                description={categoriesRender}
                onPress={this.props.onPress}
                left={(props) => <Avatar.Image
                    {...props}
                    style={{backgroundColor: 'transparent'}}
                    size={64}
                    source={{uri: this.props.item.logo}}/>}
                right={(props) => <Avatar.Icon
                    {...props}
                    style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        backgroundColor: 'transparent',
                    }}
                    size={48}
                    icon={this.hasManagers ? "check-circle-outline" : "alert-circle-outline"}
                    color={this.hasManagers ? this.colors.success : this.colors.primary}
                />}
            />
        );
    }
}

export default withTheme(ClubListItem);
