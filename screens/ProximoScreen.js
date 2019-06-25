import React from 'react';
import {StyleSheet, View, Alert, ScrollView, RefreshControl, FlatList} from 'react-native';
import {Container, Text, Content, ListItem, Left, Thumbnail, Right, Badge} from 'native-base';
import CustomHeader from "../components/CustomHeader";

const DATA_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/data.txt";
const IMG_URL = "https://etud.insa-toulouse.fr/~vergnet/appli-amicale/img/";

const defaultImage = require('../assets/image-missing.png');

export default class ProximoScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            data: undefined
        };
    }

    async readData() {
        try {
            let response = await fetch(
                'https://etud.insa-toulouse.fr/~vergnet/appli-amicale/data.txt',
            );
            let responseText = await response.text();
            let responseArray = responseText.split('\n');
            let responseFinal = [];
            for (let i = 0; i < responseArray.length; i++) {
                if (responseArray[i] !== "") {
                    let itemArray = responseArray[i]
                        .replace('[', '')
                        .replace(']', '')
                        .split(',')[1]
                        .split(';');
                    let object = {
                        name: itemArray[0],
                        price: itemArray[1],
                        image: defaultImage
                    };
                    responseFinal.push(object);
                }
            }
            this.setState({data: responseFinal});
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.readData().then(() => {
            this.setState({refreshing: false});
            // console.log(this.state.data);
        });
    };


    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Proximo'}/>
                <Content>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={(item, index) => item.name}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        style={{minHeight: 300, width: '100%'}}
                        renderItem={({item}) =>
                            <ListItem
                                onPress={() => {
                                    console.log(IMG_URL + item.name + '.jpg')
                                }}
                            >
                                <Left>
                                    <Thumbnail square source={{ uri: IMG_URL + item.name + '.jpg' }} />
                                    <Text style={{marginLeft: 20}}>
                                        {item.name}
                                    </Text>
                                </Left>
                                <Right style={{ flex: 1 }}>
                                    <Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
