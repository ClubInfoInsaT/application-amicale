// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Headline, withTheme} from "react-native-paper";
import i18n from 'i18n-js';
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    theme: CustomTheme
}

class VoteNotAvailable extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
            }}>
                <Headline
                    style={{
                        color: this.props.theme.colors.textDisabled,
                        textAlign: "center",
                    }}
                >{i18n.t("screens.vote.noVote")}</Headline>
            </View>
        );
    }
}

export default withTheme(VoteNotAvailable);
