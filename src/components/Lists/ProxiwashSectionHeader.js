import * as React from 'react';
import {Avatar, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import i18n from "i18n-js";

type Props = {
    title: string,
    isDryer: boolean,
    nbAvailable: number,
}

/**
 * Component used to display a proxiwash item, showing machine progression and state
 */
class ProxiwashListItem extends React.Component<Props> {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.nbAvailable !== this.props.nbAvailable)
    }

    render() {
        const props = this.props;
        const subtitle = props.nbAvailable + ' ' + (
            (props.nbAvailable <= 1)
                ? i18n.t('proxiwashScreen.numAvailable')
                : i18n.t('proxiwashScreen.numAvailablePlural'));
        return (
            <View style={styles.container}>
                <Avatar.Icon
                    icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
                    color={this.props.theme.colors.primary}
                    style={styles.icon}
                />
                <View style={{justifyContent: 'center'}}>
                    <Text style={styles.text}>
                        {props.title}
                    </Text>
                    <Text style={{color: this.props.theme.colors.subtitle}}>
                        {subtitle}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
        marginTop: 20,
    },
    icon: {
        backgroundColor: 'transparent'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default withTheme(ProxiwashListItem);
