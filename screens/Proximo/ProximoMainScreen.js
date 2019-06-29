// @flow

import * as React from 'react';
import {RefreshControl, SectionList} from 'react-native';
import {Container, Text, ListItem, Left, Right, Body, Badge, Toast, H2} from 'native-base';
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

type Props = {
    navigation: Object
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    data: Object,
};

/**
 * Class defining the main proximo screen. This screen shows the different categories of articles
 * offered by proximo.
 */
export default class ProximoMainScreen extends React.Component<Props, State> {

    state = {
        refreshing: false,
        firstLoading: true,
        data: {},
    };

    /**
     * Generate the dataset using types and data.
     * This will group items under the same type.
     *
     * @param types An array containing the types available (categories)
     * @param data The array of articles represented by objects
     * @returns {Array} The formatted dataset
     */
    static generateDataset(types: Array<string>, data: Array<Object>) {
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

    /**
     * Async function reading data from the proximo website and setting the state to rerender the list
     *
     * @returns {Promise<void>}
     */
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

    /**
     * Refresh the list on first screen load
     */
    componentDidMount() {
        this._onRefresh();
    }

    /**
     * Display a loading indicator and fetch data from the internet
     *
     * @private
     */
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

    /**
     * Renders the proximo categories list.
     * If we are loading for the first time, change the data for the SectionList to display a loading message.
     *
     * @returns {react.Node}
     */
    render() {
        const nav = this.props.navigation;
        const data = [
            {
                title: i18n.t('proximoScreen.listTitle'),
                data: this.state.data,
                extraData: this.state,
            }
        ];
        const loadingData = [
            {
                title: i18n.t('proximoScreen.loading'),
                data: []
            }
        ];
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Proximo'}/>
                <SectionList
                    sections={this.state.firstLoading ? loadingData : data}
                    keyExtractor={(item, index) => item.type}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{minHeight: 300, width: '100%'}}
                    renderSectionHeader={({section: {title}}) => (
                        <H2 style={{textAlign: 'center', paddingVertical: 10}}>{title}</H2>
                    )}
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

