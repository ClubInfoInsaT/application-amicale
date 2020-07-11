// @flow

import * as React from 'react';
import {Avatar, Button, Card, Paragraph, Portal, withTheme} from 'react-native-paper';
import Mascot from "./Mascot";
import * as Animatable from "react-native-animatable";
import {Dimensions, ScrollView, TouchableWithoutFeedback, View} from "react-native";
import type {CustomTheme} from "../../managers/ThemeManager";

type Props = {
    visible: boolean,
    theme: CustomTheme,
    icon: string,
    title: string,
    message: string,
    buttons: {
        action: {
            message: string,
            icon: string | null,
            color: string | null,
            onPress: () => void,
        },
        cancel: {
            message: string,
            icon: string | null,
            color: string | null,
            onPress: () => void,
        }
    },
    emotion: number,
}

type State = {
    shouldShowDialog: boolean;
}


class MascotPopup extends React.Component<Props, State> {

    mascotSize: number;
    windowWidth: number;
    windowHeight: number;

    state = {
        shouldShowDialog: this.props.visible,
    };


    constructor(props: Props) {
        super(props);

        this.windowWidth = Dimensions.get('window').width;
        this.windowHeight = Dimensions.get('window').height;

        this.mascotSize = Dimensions.get('window').height / 6;
    }

    onAnimationEnd = () => {
        this.setState({
            shouldShowDialog: this.props.visible,
        })
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        if (nextProps.visible)
            this.state.shouldShowDialog = true;
        else if (nextProps.visible !== this.props.visible)
            setTimeout(this.onAnimationEnd, 300);
        return true;
    }

    getSpeechBubble() {
        return (
            <Animatable.View
                style={{
                    marginLeft: "10%",
                    marginRight: "10%",
                }}
                useNativeDriver={true}
                animation={this.props.visible ? "bounceInLeft" : "bounceOutLeft"}
                duration={this.props.visible ? 1000 : 300}
            >
                <View style={{
                    marginLeft: this.mascotSize / 3,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 20,
                    borderBottomWidth: 20,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: this.props.theme.colors.mascotMessageArrow,
                }}/>
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

                    <Card.Actions>
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
                animation={this.props.visible ? "bounceInLeft" : "bounceOutLeft"}
                duration={this.props.visible ? 1500 : 200}
            >
                <Mascot
                    size={this.mascotSize}
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
                flexDirection: "row",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}>
                {cancel != null
                    ? <Button
                        mode={"contained"}
                        icon={cancel.icon}
                        color={cancel.color}
                        onPress={cancel.onPress}
                    >
                        {cancel.message}
                    </Button>
                    : null}
                {action != null
                    ? <Button
                        style={{
                            marginLeft: 20,
                        }}
                        mode={"contained"}
                        icon={action.icon}
                        color={action.color}
                        onPress={action.onPress}
                    >
                        {action.message}
                    </Button>
                    : null}
            </View>
        );
    }

    getBackground() {
        return (
            <TouchableWithoutFeedback onPress={this.props.buttons.cancel.onPress}>
                <Animatable.View
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        width: "100%",
                        height: "100%",
                    }}
                    useNativeDriver={true}
                    animation={this.props.visible ? "fadeIn" : "fadeOut"}
                    duration={this.props.visible ? 300 : 300}
                />
            </TouchableWithoutFeedback>

        );
    }

    render() {
        if (this.state.shouldShowDialog) {
            return (
                <Portal>
                    {this.getBackground()}
                    <View style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}>
                        {this.getMascot()}
                        {this.getSpeechBubble()}
                    </View>
                </Portal>
            );
        } else
            return null;

    }
}

export default withTheme(MascotPopup);
