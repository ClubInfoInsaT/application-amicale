import * as React from 'react';
import {Text, withTheme} from 'react-native-paper';
import HTML from "react-native-render-html";
import {Linking} from "react-native";

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

    getBasicText = (htmlAttribs, children, convertedCSSStyles, passProps) => {
        // console.log(convertedCSSStyles);
        return <Text {...passProps}>{children}</Text>;
    };

    render() {
        // Surround description with p to allow text styling if the description is not html
        return <HTML
            html={"<p>" + this.props.html + "</p>"}
            renderers={{
                p: this.getBasicText,
            }}
            ignoredStyles={['color', 'background-color']}

            onLinkPress={this.openWebLink}/>;
    }
}

export default withTheme(CustomHTML);
