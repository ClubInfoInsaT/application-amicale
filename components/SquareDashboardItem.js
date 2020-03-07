import * as React from 'react';
import {Card, Text, Title, withTheme} from 'react-native-paper';
import {View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function SquareDashboardItem(props) {
    const { colors } = props.theme;
    return (
        <Card
            style={{
                width: '48%',
                marginTop: 10,
                marginRight: props.isLeft ? '4%': 0,
                overflow: 'hidden',
            }}
            onPress={props.clickAction}>
            <Card.Content>
                <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <MaterialCommunityIcons
                        name={props.icon}
                        color={
                            props.isAvailable ?
                                props.color :
                                colors.textDisabled
                        }
                        size={50}/>
                </View>
                <View style={{
                    width: '100%',
                }}>
                    <Title style={{
                        color: props.isAvailable ?
                            colors.text :
                            colors.textDisabled,
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        {props.title}
                    </Title>
                    <Text style={{
                        color: props.isAvailable ?
                            colors.text :
                            colors.textDisabled,
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        {props.subtitle}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
}

export default withTheme(SquareDashboardItem);
