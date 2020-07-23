// @flow

import * as React from 'react';
import {Avatar, Button, Card, Paragraph, Portal, withTheme} from 'react-native-paper';
import Mascot from "./Mascot";
import * as Animatable from "react-native-animatable";
import {BackHandler, Dimensions, ScrollView, TouchableWithoutFeedback, View} from "react-native";
import type {CustomTheme} from "../../managers/ThemeManager";
import SpeechArrow from "./SpeechArrow";
import AsyncStorageManager from "../../managers/AsyncStorageManager";

type Props = {
    theme: CustomTheme,
    icon: string,
    title: string,
    message: string,
    buttons: {
        action: {
            message: string,
            icon: string | null,
            color: string | null,
            onPress?: () => void,
        },
        cancel: {
            message: string,
            icon: string | null,
            color: string | null,
            onPress?: () => void,
        }
    },
    emotion: number,
    visible?: boolean,
    prefKey?: string,
}

type State = {
    shouldRenderDialog: boolean, // Used to stop rendering after hide animation
    dialogVisible: boolean,
}

/**
 * Component used to display a popup with the mascot.
 */
class MascotPopup extends React.Component<Props, State> {

    mascotSize: number;
    windowWidth: number;
    windowHeight: number;

    constructor(props: Props) {
        super(props);

        this.windowWidth = Dimensions.get('window').width;
        this.windowHeight = Dimensions.get('window').height;

        this.mascotSize = Dimensions.get('window').height / 6;

        if (this.props.visible != null) {
            this.state = {
                shouldRenderDialog: this.props.visible,
                dialogVisible: this.props.visible,
            };
        } else if (this.props.prefKey != null) {
            const visible = AsyncStorageManager.getBool(this.props.prefKey);
            this.state = {
                shouldRenderDialog: visible,
                dialogVisible: visible,
            };
        } else {
            this.state = {
                shouldRenderDialog: false,
                dialogVisible: false,
            };
        }

    }

    onAnimationEnd = () => {
        this.setState({
            shouldRenderDialog: false,
        })
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        if (nextProps.visible) {
            this.state.shouldRenderDialog = true;
            this.state.dialogVisible = true;
        } else if (nextProps.visible !== this.props.visible
            || (!nextState.dialogVisible && nextState.dialogVisible !== this.state.dialogVisible)) {
            this.state.dialogVisible = false;
            setTimeout(this.onAnimationEnd, 300);
        }
        return true;
    }

    componentDidMount(): * {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid
        )
    }

    onBackButtonPressAndroid = () => {
        if (this.state.dialogVisible) {
            const cancel = this.props.buttons.cancel;
            const action = this.props.buttons.action;
            if (cancel != null)
                this.onDismiss(cancel.onPress);
            else
                this.onDismiss(action.onPress);
            return true;
        } else {
            return false;
        }
    };

    getSpeechBubble() {
        return (
            <Animatable.View
                style={{
                    marginLeft: "10%",
                    marginRight: "10%",
                }}
                useNativeDriver={true}
                animation={this.state.dialogVisible ? "bounceInLeft" : "bounceOutLeft"}
                duration={this.state.dialogVisible ? 1000 : 300}
            >
                <SpeechArrow
                    style={{marginLeft: this.mascotSize / 3}}
                    size={20}
                    color={this.props.theme.colors.mascotMessageArrow}
                />
                <Card style={{
                    borderColor: this.props.theme.colors.mascotMessageArrow,
                    borderWidth: 4,
                    borderRadius: 10,
                }}>
                    <Card.Title
                        title={this.props.title}
                        left={this.props.icon != null ?
                            (props) => <Avatar.Icon
                                {...props}
                                size={48}
                                style={{backgroundColor: "transparent"}}
                                color={this.props.theme.colors.primary}
                                icon={this.props.icon}
                            />

                            : null}
                    />

                    <Card.Content style={{
                        maxHeight: this.windowHeight / 3
                    }}>
                        <ScrollView>
                            <Paragraph style={{marginBottom: 10}}>
                                {this.props.message}
                            </Paragraph>
                        </ScrollView>
                    </Card.Content>

                    <Card.Actions style={{marginTop: 10, marginBottom: 10}}>
                        {this.getButtons()}
                    </Card.Actions>
                </Card>
            </Animatable.View>
        );
    }

    getMascot() {
        return (
            <Animatable.View
                useNativeDriver={true}
                animation={this.state.dialogVisible ? "bounceInLeft" : "bounceOutLeft"}
                duration={this.state.dialogVisible ? 1500 : 200}
            >
                <Mascot
                    style={{width: this.mascotSize}}
                    animated={true}
                    emotion={this.props.emotion}
                />
            </Animatable.View>
        );
    }

    getButtons() {
        const action = this.props.buttons.action;
        const cancel = this.props.buttons.cancel;
        return (
            <View style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}>
                {action != null
                    ? <Button
                        style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: 10,
                        }}
                        mode={"contained"}
                        icon={action.icon}
                        color={action.color}
                        onPress={() => this.onDismiss(action.onPress)}
                    >
                        {action.message}
                    </Button>
                    : null}
                {cancel != null
                    ? <Button
                        style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        mode={"contained"}
                        icon={cancel.icon}
                        color={cancel.color}
                        onPress={() => this.onDismiss(cancel.onPress)}
                    >
                        {cancel.message}
                    </Button>
                    : null}
            </View>
        );
    }

    getBackground() {
        return (
            <TouchableWithoutFeedback onPress={() => this.onDismiss(this.props.buttons.cancel.onPress)}>
                <Animatable.View
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        width: "100%",
                        height: "100%",
                    }}
                    useNativeDriver={true}
                    animation={this.state.dialogVisible ? "fadeIn" : "fadeOut"}
                    duration={this.state.dialogVisible ? 300 : 300}
                />
            </TouchableWithoutFeedback>

        );
    }

    onDismiss = (callback?: ()=> void) => {
        if (this.props.prefKey != null) {
            AsyncStorageManager.set(this.props.prefKey, false);
            this.setState({dialogVisible: false});
        }
        if (callback != null)
            callback();
    }

    render() {
        if (this.state.shouldRenderDialog) {
            return (
                <Portal>
                    {this.getBackground()}
                    <View style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}>
                        <View style={{
                            marginTop: -80,
                            width: "100%"
                        }}>
                            {this.getMascot()}
                            {this.getSpeechBubble()}
                        </View>

                    </View>
                </Portal>
            );
        } else
            return null;

    }
}

export default withTheme(MascotPopup);
