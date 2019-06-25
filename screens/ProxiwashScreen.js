import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Container, Text} from 'native-base';
import CustomHeader from "../components/CustomHeader";

export default class ProxiwashScreen extends React.Component {
    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Proxiwash'}/>
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
