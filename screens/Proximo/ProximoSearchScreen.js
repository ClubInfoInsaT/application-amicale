// @flow

import * as React from 'react';
import {Body, Container, Content, Left, ListItem, Right, Text, Thumbnail,} from 'native-base';
import {FlatList} from "react-native";
import i18n from "i18n-js";
import ThemeManager from "../../utils/ThemeManager";
import SearchHeader from "../../components/SearchHeader";

type Props = {
    navigation: Object,
};

type State = {
    filteredData: Array<Object>,
};

/**
 * Class defining proximo's article list of a certain category.
 */
export default class ProximoSearchScreen extends React.Component<Props, State> {
    state = {
        filteredData: this.props.navigation.getParam('data', {articles: [{name: "Error"}]}).articles,
    };


    /**
     * get color depending on quantity available
     *
     * @param availableStock
     * @return
     */
    getStockColor(availableStock: number) {
        let color: string;
        if (availableStock > 3)
            color = ThemeManager.getCurrentThemeVariables().brandSuccess;
        else if (availableStock > 0)
            color = ThemeManager.getCurrentThemeVariables().brandWarning;
        else
            color = ThemeManager.getCurrentThemeVariables().brandDanger;
        return color;
    }


    showItemDetails(item: Object) {
        //TODO: implement onClick function (copy-paste from ProximoListScreen)
    }

    /**
     * Returns only the articles whose name contains str. Case and accents insensitive.
     * @param str
     * @returns {[]}
     */
    filterData(str: string) {
        let filteredData = [];
        const testStr: String = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const articles: Object = this.props.navigation.getParam('data', {articles: [{name: "Error"}]}).articles;
        for (const article: Object of articles) {
            const name: String = String(article.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
            if (name.includes(testStr)) {
                filteredData.push(article)
            }
        }
        return filteredData;
    }

    search(str: string) {
        this.setState({
            filteredData: this.filterData(str)
        })
    }

    render() {
        return (
            <Container>
                <SearchHeader searchFunction={this.search.bind(this)} navigation={this.props.navigation}/>
                <Content>
                    <FlatList
                        data={this.state.filteredData}
                        keyExtractor={(item) => item.name + item.code}
                        style={{minHeight: 300, width: '100%'}}
                        renderItem={({item}) =>
                            <ListItem
                                thumbnail
                                onPress={() => {this.showItemDetails(item);}} >
                                <Left>
                                    <Thumbnail square source={{uri: item.image}}/>
                                </Left>
                                <Body>
                                    <Text style={{marginLeft: 20}}>
                                        {item.name}
                                    </Text>
                                    <Text note style={{
                                        marginLeft: 20,
                                        color: this.getStockColor(parseInt(item.quantity))
                                    }}>
                                        {item.quantity + ' ' + i18n.t('proximoScreen.inStock')}
                                    </Text>
                                </Body>
                                <Right>
                                    <Text style={{fontWeight: "bold"}}>
                                        {item.price}€
                                    </Text>
                                </Right>
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}
