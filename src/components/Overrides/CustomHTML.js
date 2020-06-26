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
        return <Text {...passProps}>{children}</Text>;
    };

    getListBullet = (htmlAttribs, children, convertedCSSStyles, passProps) => {
        return (
            <Text>- </Text>
        );
    };

    render() {
        // Surround description with p to allow text styling if the description is not html
        return <HTML
            html={"<p>" + this.props.html + "</p>"}
            renderers={{
                p: this.getBasicText,
                li: this.getBasicText,
            }}
            listsPrefixesRenderers={{
                ul: this.getListBullet
            }}
            ignoredTags={['img']}
            ignoredStyles={['color', 'background-color']}
            onLinkPress={this.openWebLink}/>;
    }
}

export default withTheme(CustomHTML);
