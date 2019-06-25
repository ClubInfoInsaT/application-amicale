import React from 'react';
import {Container, Content, Text, Button, Icon} from 'native-base';
import CustomHeader from '../components/CustomHeader';
import i18n from "i18n-js";

import { Notifications } from 'expo';


export default class HomeScreen extends React.Component {
    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.home')}/>
                <Content>
                    <Button>
                        <Icon
                            active
                            name={'bell-ring'}
                            type={'MaterialCommunityIcons'}
                        />
                        <Text>Notif</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
