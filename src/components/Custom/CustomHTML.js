import * as React from 'react';
import {View} from "react-native";
import {withTheme} from 'react-native-paper';
import HTML from "react-native-render-html";
import {Linking} from "expo";

type Props = {
    theme: Object,
    html: string,
}

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomHTML extends React.Component<Props> {

    openWebLink = (event, link) => {
        Linking.openURL(link).catch((err) => console.error('Error opening link', err));
    };

    getHTML() {
        // Surround description with div to allow text styling if the description is not html
        return <HTML html={"<div>" + this.props.html + "</div>"}
                     tagsStyles={{
                         p: {color: this.props.theme.colors.text},
                         div: {color: this.props.theme.colors.text}
                     }}
                     onLinkPress={this.openWebLink}/>;
    }

    render() {
        // Completely recreate the component on theme change to force theme reload
        if (this.props.theme.dark)
            return (
                <View style={{flex: 1}}>
                    {this.getHTML()}
                </View>
            );
        else
            return this.getHTML();
    }
}

export default withTheme(CustomHTML);
