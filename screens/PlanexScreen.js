// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Container, Content, Spinner} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import WebView from "react-native-webview";

type Props = {
    navigation: Object,
}

type State = {
    isFinishedLoading: boolean
}

const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class PlanningScreen extends React.Component<Props, State> {

    state = {
        isFinishedLoading: false,
    };

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={'Planex'}/>
                <WebView
                    source={{uri: PLANEX_URL}}
                    style={{width: this.state.isFinishedLoading ? '100%' : 0}}
                    onLoadEnd={() => {
                        this.setState({isFinishedLoading: true})
                    }}
                />
                {this.state.isFinishedLoading ?
                    <View/> :
                    <Content>
                        <Spinner/>
                    </Content>}
            </Container>
        );
    }
}

