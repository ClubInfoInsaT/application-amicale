// @flow

import * as React from 'react';
import {Container, Content, Text, Button, Icon} from 'native-base';
import CustomHeader from '../components/CustomHeader';
import i18n from "i18n-js";
import NotificationsManager from '../utils/NotificationsManager'

type Props = {
    navigation: Object,
}

/**
 * Class defining the app's home screen
 */
export default class HomeScreen extends React.Component<Props> {
    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.home')}/>
                <Content padder>
                    <Button onPress={() => NotificationsManager.sendNotificationImmediately('coucou', 'whoa')}>
                        <Icon
                            active
                            name={'bell-ring'}
                            type={'MaterialCommunityIcons'}
                        />
                        <Text>Instant Notification</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}
