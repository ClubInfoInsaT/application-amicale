// @flow

import * as React from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {Button, Text, TextInput, Title} from 'react-native-paper';
import ConnectionManager from "../../managers/ConnectionManager";

type Props = {
    navigation: Object,
}

type State = {
    email: string,
    password: string,
}


export default class LoginScreen extends React.Component<Props, State> {

    state = {
        email: '',
        password: '',
    };

    onEmailChange: Function;
    onPasswordChange: Function;

    constructor() {
        super();
        this.onEmailChange = this.onInputChange.bind(this, true);
        this.onPasswordChange = this.onInputChange.bind(this, false);
    }

    onInputChange(isEmail: boolean, value: string) {
        if (isEmail)
            this.setState({email: value});
        else
            this.setState({password: value});
    }

    onSubmit() {
        console.log('pressed');
        ConnectionManager.getInstance().connect(this.state.email, this.state.password)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={"padding"}
                contentContainerStyle={styles.container}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Title>COUCOU</Title>
                        <Text>entrez vos identifiants</Text>
                        <TextInput
                            label='Email'
                            mode='outlined'
                            value={this.state.email}
                            onChangeText={this.onEmailChange}
                        />
                        <TextInput
                            label='Password'
                            mode='outlined'
                            value={this.state.password}
                            onChangeText={this.onPasswordChange}
                        />
                        <View style={styles.btnContainer}>
                            <Button icon="send" onPress={() => this.onSubmit()}>
                                LOGIN
                            </Button>
                        </View>
                        <Text>Pas de compte, dommage !</Text>
                        <View style={styles.btnContainer}>
                            <Button icon="send" onPress={() => console.log('Pressed')}>
                                Créer un compte
                            </Button>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {},
    btnContainer: {
        marginTop: 12
    }
});
