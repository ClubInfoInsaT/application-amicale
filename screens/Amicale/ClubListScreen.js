// @flow

import * as React from 'react';
import {View} from "react-native";
import {Avatar, Chip, List, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import PureFlatList from "../../components/Lists/PureFlatList";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {}

class ClubListScreen extends React.Component<Props, State> {

    state = {};

    colors: Object;

    getRenderItem: Function;

    categories: Array<Object>;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    keyExtractor = (item: Object) => {
        return item.name + item.logo;
    };

    getScreen = (data: Object) => {
        this.categories = data.categories;
        return (
            <PureFlatList
                data={data.clubs}
                keyExtractor={this.keyExtractor}
                renderItem={this.getRenderItem}
                updateData={0}
            />
        )
    };

    getCategoryName(id: number) {
        for (let i = 0; i < this.categories.length; i++) {
            if (id === this.categories[i].id)
                return this.categories[i].name;
        }
        return "";
    }

    getCategoriesRender(categories: Array<number|null>) {
        let final = [];
        for (let i = 0; i < categories.length; i++) {
            if (categories[i] !== null)
                final.push(<Chip style={{marginRight: 5}}>{this.getCategoryName(categories[i])}</Chip>);
        }
        return <View style={{flexDirection: 'row'}}>{final}</View>;
    }

    getRenderItem = ({item}: Object) => {
        const onPress = this.onListItemPress.bind(this, item);
        const categoriesRender = this.getCategoriesRender.bind(this, item.category);
        return (
            <List.Item
                title={item.name}
                description={categoriesRender}
                onPress={onPress}
                left={(props) => <Avatar.Image
                    {...props}
                    style={{backgroundColor: 'transparent'}}
                    size={64}
                    source={{uri: item.logo}}/>}
            />
        );
    };

    /**
     * Callback used when clicking an article in the list.
     * It opens the modal to show detailed information about the article
     *
     * @param item The article pressed
     */
    onListItemPress(item: Object) {
        this.props.navigation.navigate("ClubDisplayScreen", {data: item});
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                link={'https://www.amicale-insat.fr/api/clubs/list'}
                renderFunction={this.getScreen}
            />
        );
    }
}

export default withTheme(ClubListScreen);
