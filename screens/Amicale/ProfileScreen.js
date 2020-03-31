import * as React from 'react';
import {View} from "react-native";
import {Text, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/AuthenticatedScreen";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
}

class ProfileScreen extends React.Component<Props, State> {

    state = {
    };

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getScreen(data: Object) {

        return (
            <View>
                <Text>{data.first_name} {Math.random()}</Text>
            </View>
        )
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                link={'https://www.amicale-insat.fr/api/user/profile'}
                renderFunction={(data) => this.getScreen(data)}
            />
        );
    }

}

export default withTheme(ProfileScreen);
