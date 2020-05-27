// @flow

import * as React from 'react';
import {Avatar, Chip, List, withTheme} from 'react-native-paper';
import {View} from "react-native";
import type {category, club} from "../../../screens/Amicale/Clubs/ClubListScreen";
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    onPress: () => void,
    categoryTranslator: (id: number) => category,
    item: club,
    height: number,
    theme: CustomTheme,
}

class ClubListItem extends React.Component<Props> {

    hasManagers: boolean;

    constructor(props) {
        super(props);
        this.hasManagers = props.item.responsibles.length > 0;
    }

    shouldComponentUpdate() {
        return false;
    }

    getCategoriesRender(categories: Array<number | null>) {
        let final = [];
        for (let i = 0; i < categories.length; i++) {
            if (categories[i] !== null) {
                const category: category = this.props.categoryTranslator(categories[i]);
                final.push(
                    <Chip
                        style={{marginRight: 5, marginBottom: 5}}
                        key={this.props.item.id + ':' + category.id}
                    >
                        {category.name}
                    </Chip>
                );
            }
        }
        return <View style={{flexDirection: 'row'}}>{final}</View>;
    }

    render() {
        const categoriesRender = this.getCategoriesRender.bind(this, this.props.item.category);
        const colors = this.props.theme.colors;
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
                    color={this.hasManagers ? colors.success : colors.primary}
                />}
                style={{
                    height: this.props.height,
                    justifyContent: 'center',
                }}
            />
        );
    }
}

export default withTheme(ClubListItem);
