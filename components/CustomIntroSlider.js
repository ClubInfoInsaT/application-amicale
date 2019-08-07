// @flow

import * as React from 'react';
import {LinearGradient} from "expo-linear-gradient";
import {Image, StyleSheet, View} from "react-native";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Text} from "native-base";
import i18n from 'i18n-js';
import AppIntroSlider from "react-native-app-intro-slider";

// Content to be used int the intro slides

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
});

type Props = {
    onDone: Function,
};

export default class CustomIntroSlider extends React.Component<Props> {

    slides: Array<Object>;

    constructor() {
        super();
        this.slides = [
            {
                key: '1',
                title: i18n.t('intro.slide1.title'),
                text: i18n.t('intro.slide1.text'),
                image: require('../assets/drawer-cover.png'),
                colors: ['#e01928', '#be1522'],
            },
            {
                key: '2',
                title: i18n.t('intro.slide2.title'),
                text: i18n.t('intro.slide2.text'),
                icon: 'calendar-range',
                colors: ['#d99e09', '#c28d08'],
            },
            {
                key: '3',
                title: i18n.t('intro.slide3.title'),
                text: i18n.t('intro.slide3.text'),
                icon: 'washing-machine',
                colors: ['#1fa5ee', '#1c97da'],
            },
            {
                key: '4',
                title: i18n.t('intro.slide4.title'),
                text: i18n.t('intro.slide4.text'),
                icon: 'shopping',
                colors: ['#ec5904', '#da5204'],
            },
            {
                key: '5',
                title: i18n.t('intro.slide5.title'),
                text: i18n.t('intro.slide5.text'),
                icon: 'timetable',
                colors: ['#7c33ec', '#732fda'],
            },
            {
                key: '6',
                title: i18n.t('intro.slide6.title'),
                text: i18n.t('intro.slide6.text'),
                icon: 'cogs',
                colors: ['#37c13e', '#26852b'],
            },
        ];
    }


    /**
     * Render item to be used for the intro slides
     * @param item
     * @param dimensions
     */
    static getIntroRenderItem(item: Object, dimensions: Object) {

        return (
            <LinearGradient
                style={[
                    styles.mainContent,
                    dimensions,
                ]}
                colors={item.colors}
                start={{x: 0, y: 0.1}}
                end={{x: 0.1, y: 1}}
            >
                {item.image !== undefined ?
                    <Image source={item.image} style={styles.image}/>
                    : <CustomMaterialIcon icon={item.icon} color={'#fff'} fontSize={200} width={200}/>}
                <View style={{marginTop: 20}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </LinearGradient>
        );
    }

    render() {
        return (
            <AppIntroSlider renderItem={({item, dimensions}) => CustomIntroSlider.getIntroRenderItem(item, dimensions)}
                            slides={this.slides} onDone={() => this.props.onDone()} bottomButton showSkipButton/>
        );
    }

}


