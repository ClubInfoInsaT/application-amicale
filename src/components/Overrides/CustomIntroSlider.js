// @flow

import * as React from 'react';
import {Image, Platform, StatusBar, StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text} from "react-native-paper";
import i18n from 'i18n-js';
import AppIntroSlider from "react-native-app-intro-slider";
import Update from "../../constants/Update";
import ThemeManager from "../../managers/ThemeManager";
import LinearGradient from 'react-native-linear-gradient';

type Props = {
    onDone: Function,
    isUpdate: boolean,
    isAprilFools: boolean,
};

/**
 * Class used to create intro slides
 */
export default class CustomIntroSlider extends React.Component<Props> {

    sliderRef: {current: null | AppIntroSlider};

    introSlides: Array<Object>;
    updateSlides: Array<Object>;
    aprilFoolsSlides: Array<Object>;
    currentSlides: Array<Object>;

    /**
     * Generates intro slides
     */
    constructor() {
        super();
        this.sliderRef = React.createRef();
        this.introSlides = [
            {
                key: '1',
                title: i18n.t('intro.slide1.title'),
                text: i18n.t('intro.slide1.text'),
                image: require('../../../assets/splash.png'),
                colors: ['#dc2634', '#be1522'],
            },
            {
                key: '2',
                title: i18n.t('intro.slide2.title'),
                text: i18n.t('intro.slide2.text'),
                icon: 'calendar-range',
                colors: ['#d99e09', '#9e7205'],
            },
            {
                key: '3',
                title: i18n.t('intro.slide3.title'),
                text: i18n.t('intro.slide3.text'),
                icon: 'washing-machine',
                colors: ['#1fa5ee', '#0976b1'],
            },
            {
                key: '4',
                title: i18n.t('intro.slide4.title'),
                text: i18n.t('intro.slide4.text'),
                icon: 'shopping',
                colors: ['#ec5904', '#b64300'],
            },
            {
                key: '5',
                title: i18n.t('intro.slide5.title'),
                text: i18n.t('intro.slide5.text'),
                icon: 'timetable',
                colors: ['#7c33ec', '#5e11d1'],
            },
            {
                key: '6',
                title: i18n.t('intro.slide6.title'),
                text: i18n.t('intro.slide6.text'),
                icon: 'silverware-fork-knife',
                colors: ['#ec1213', '#970902'],
            },
            {
                key: '7',
                title: i18n.t('intro.slide7.title'),
                text: i18n.t('intro.slide7.text'),
                icon: 'cogs',
                colors: ['#37c13e', '#1a5a1d'],
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
                    <View style={styles.image}>
                        <Image
                            source={item.image}
                            resizeMode={"contain"}
                            style={{width: '100%', height: '100%'}}
                            />
                    </View>
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

    setStatusBarColor(color: string) {
        if (Platform.OS === 'android')
            StatusBar.setBackgroundColor(color, true);
    }

    onSlideChange = (index: number, lastIndex: number) => {
        this.setStatusBarColor(this.currentSlides[index].colors[0]);
    };

    onSkip = () => {
        this.setStatusBarColor(this.currentSlides[this.currentSlides.length-1].colors[0]);
        if (this.sliderRef.current != null)
            this.sliderRef.current.goToSlide(this.currentSlides.length-1);
    }

    onDone = () => {
        this.setStatusBarColor(ThemeManager.getCurrentTheme().colors.surface);
        this.props.onDone();
    }

    render() {
        this.currentSlides = this.introSlides;
        if (this.props.isUpdate)
            this.currentSlides = this.updateSlides;
        else if (this.props.isAprilFools)
            this.currentSlides = this.aprilFoolsSlides;
        this.setStatusBarColor(this.currentSlides[0].colors[0]);
        return (
            <AppIntroSlider
                ref={this.sliderRef}
                renderItem={CustomIntroSlider.getIntroRenderItem}
                data={this.currentSlides}
                onDone={this.onDone}
                bottomButton
                showSkipButton
                onSlideChange={this.onSlideChange}
                onSkip={this.onSkip}
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
