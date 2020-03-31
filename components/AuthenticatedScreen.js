import * as React from 'react';
import {View} from "react-native";
import {ActivityIndicator, Text, withTheme} from 'react-native-paper';
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

class AuthenticatedScreen extends React.Component<Props, State> {

    state = {
        loading: true,
    };

    currentUserToken: string;
    connectionManager: ConnectionManager;
    data: Object;
    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.connectionManager = ConnectionManager.getInstance();
        this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));

        this.fetchData();
    }

    onScreenFocus() {
        if (this.currentUserToken !== this.connectionManager.getToken())
            this.fetchData();
    }

    fetchData() {
        if (!this.state.loading)
            this.setState({loading: true});
        this.connectionManager.isLoggedIn()
            .then(() => {
                this.connectionManager.authenticatedRequest(this.props.link)
                    .then((data) => {
                        this.onFinishedLoading(data);
                    })
                    .catch((error) => {
                        this.onFinishedLoading(undefined);
                    });
            })
            .catch(() => {
                this.onFinishedLoading(undefined);
            });
    }

    onFinishedLoading(data: Object) {
        this.data = data;
        this.currentUserToken = data !== undefined
            ? this.connectionManager.getToken()
            : '';
        this.setState({loading: false});
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading() {
        return (
            <View style={{
                backgroundColor: this.colors.background,
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                    color={this.colors.primary}/>
            </View>
        );
    }

    getErrorRender() {
        return <Text>ERROR</Text>;
    }

    render() {
        return (
            this.state.loading
                ? this.getRenderLoading()
                : (this.data !== undefined
                ? this.props.renderFunction(this.data)
                : this.getErrorRender())
        );
    }

}

export default withTheme(AuthenticatedScreen);
