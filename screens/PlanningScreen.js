import React from 'react';
import { StyleSheet, View } from 'react-native';
import {Container, Text} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import i18n from "i18n-js";

export default class PlanningScreen extends React.Component {
    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.planning')}/>
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
