// @flow

import * as React from 'react';
import {Container, Text} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import i18n from "i18n-js";

type Props = {
    navigation: Object,
}

export default class PlanningScreen extends React.Component<Props> {
    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.planning')}/>
            </Container>
        );
    }
}

