import * as React from 'react';
import {View} from "react-native";
import {Text} from 'react-native-paper';
import ConnectionManager from "../managers/ConnectionManager";

type Props = {
    navigation: Object,
    theme: Object,
    link: string,
    renderFunction: Function,
}

type State = {
    loading: boolean,
}

export default class AuthenticatedScreen extends React.Component<Props, State> {

    state = {
        loading: true,
    };

    connectionManager: ConnectionManager;

    constructor(props) {
        super(props);
        this.connectionManager = ConnectionManager.getInstance();
        this.connectionManager.isLoggedIn()
            .then(() => {
                this.setState({loading: false});
                this.connectionManager.authenticatedRequest(this.props.link)
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch(() => {
                this.props.navigation.navigate('LoginScreen');
            });
    }

    render() {
        return (
            this.state.loading
                ? <View><Text>LOADING</Text></View>
                : this.props.renderFunction()
        );
    }

}
