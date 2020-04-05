// @flow

import * as React from 'react';
import {LinearGradient} from "expo-linear-gradient";
import {Image, StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text} from "react-native-paper";
import i18n from 'i18n-js';
import AppIntroSlider from "react-native-app-intro-slider";
import Update from "../../constants/Update";

type Props = {
    onDone: Function,
    isUpdate: boolean,
    isAprilFools: boolean,
};

/**
 * Class used to create intro slides
 */
export default class CustomIntroSlider extends React.Component<Props> {

    introSlides: Array<Object>;
    updateSlides: Array<Object>;
    aprilFoolsSlides: Array<Object>;

    /**
     * Generates intro slides
     */
    constructor() {
        super();
        this.introSlides = [
            {
                key: '1',
                title: i18n.t('intro.slide1.title'),
                text: i18n.t('intro.slide1.text'),
                image: require('../../../assets/splash.png'),
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
                icon: 'silverware-fork-knife',
                colors: ['#ec1213', '#ff372f'],
            },
            {
                key: '7',
                title: i18n.t('intro.slide7.title'),
                text: i18n.t('intro.slide7.text'),
                icon: 'cogs',
                colors: ['#37c13e', '#26852b'],
            },
        ];
        this.updateSlides = [
            {
                key: '1',
                title: Update.getInstance().title,
                text: Update.getInstance().description,
                icon: Update.icon,
                colors: ['#e01928', '#be1522'],
            },
        ];
        this.aprilFoolsSlides = [
            {
                key: '1',
                title: i18n.t('intro.aprilFoolsSlide.title'),
                text: i18n.t('intro.aprilFoolsSlide.text'),
                icon: 'fish',
                colors: ['#e01928', '#be1522'],
            },
        ];
    }


    /**
     * Render item to be used for the intro introSlides
     *
     * @param item The item to be displayed
     * @param dimensions Dimensions of the item
     */
    static getIntroRenderItem({item, dimensions}: Object) {

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
                    : <MaterialCommunityIcons
                        name={item.icon}
                        color={'#fff'}
                        size={200}/>}
                <View style={{marginTop: 20}}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </LinearGradient>
        );
    }

    render() {
        let slides = this.introSlides;
        if (this.props.isUpdate)
            slides = this.updateSlides;
        else if (this.props.isAprilFools)
            slides = this.aprilFoolsSlides;
        return (
            <AppIntroSlider
                renderItem={CustomIntroSlider.getIntroRenderItem}
                data={slides}
                onDone={this.props.onDone}
                bottomButton
                showSkipButton
                skipLabel={i18n.t('intro.buttons.skip')}
                doneLabel={i18n.t('intro.buttons.done')}
                nextLabel={i18n.t('intro.buttons.next')}
            />
        );
    }

}


const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: -50,
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
