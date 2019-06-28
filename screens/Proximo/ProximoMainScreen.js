import React from 'react';
import {StyleSheet, RefreshControl, FlatList} from 'react-native';
import {Container, Text, Content, ListItem, Left, Right, Body, Badge, Icon, Toast} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import i18n from "i18n-js";
import CustomMaterialIcon from "../../components/CustomMaterialIcon";

const DATA_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/dataProximo.json";

const typesIcons = {
    Nouveau: "alert-decagram",
    Alimentaire: "food",
    Boissons: "bottle-wine",
    Utilitaires: "notebook",
    Default: "information-outline",
};

export default class ProximoMainScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            firstLoading: true,
            data: {},
        };
    }

    static generateDataset(types, data) {
        let finalData = [];
        for (let i = 0; i < types.length; i++) {
            finalData.push({
                type: types[i],
                data: []
            });
            for (let k = 0; k < data.length; k++) {
                if (data[k]['type'].includes(types[i])) {
                    finalData[i].data.push(data[k]);
                }
            }
        }
        return finalData;
    }

    async readData() {
        try {
            let response = await fetch(DATA_URL);
            let responseJson = await response.json();

            if (responseJson['articles'].length !== 0 && responseJson['types'].length !== 0) {
                let data = ProximoMainScreen.generateDataset(responseJson['types'], responseJson['articles']);
                this.setState({
                    data: data
                });
            } else
                this.setState({data: undefined});
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.readData().then(() => {
            this.setState({
                refreshing: false,
                firstLoading: false
            });
            Toast.show({
                text: i18n.t('proximoScreen.listUpdated'),
                buttonText: 'OK',
                type: "success",
                duration: 2000
            })
        });
    };


    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Proximo'}/>
                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.type}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{minHeight: 300, width: '100%'}}
                    renderItem={({item}) =>
                        <ListItem
                            button
                            thumbnail
                            onPress={() => {
                                nav.navigate('ProximoListScreen', item);
                            }}
                        >
                            <Left>
                                <CustomMaterialIcon
                                    icon={typesIcons[item.type] ? typesIcons[item.type] : typesIcons.Default}
                                    fontSize={30}
                                />
                            </Left>
                            <Body>
                                <Text>
                                    {item.type}
                                </Text>
                                <Badge><Text>
                                    {item.data.length} {item.data.length > 1 ? i18n.t('proximoScreen.articles') : i18n.t('proximoScreen.article')}
                                </Text></Badge>
                            </Body>
                            <Right>
                                <CustomMaterialIcon icon="chevron-right"/>
                            </Right>
                        </ListItem>}
                />
            </Container>
        );
    }
}

