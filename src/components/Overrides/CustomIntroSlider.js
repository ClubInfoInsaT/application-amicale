// @flow

import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View} from "react-native";
import type {MaterialCommunityIconsGlyphs} from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from 'i18n-js';
import AppIntroSlider from "react-native-app-intro-slider";
import Update from "../../constants/Update";
import ThemeManager from "../../managers/ThemeManager";
import LinearGradient from 'react-native-linear-gradient';
import Mascot, {MASCOT_STYLE} from "../Mascot/Mascot";
import * as Animatable from "react-native-animatable";
import {Card} from "react-native-paper";

type Props = {
    onDone: Function,
    isUpdate: boolean,
    isAprilFools: boolean,
};

type State = {
    currentSlide: number,
}

type Slide = {
    key: string,
    title: string,
    text: string,
    view: () => React.Node,
    mascotStyle: number,
    colors: [string, string]
};

/**
 * Class used to create intro slides
 */
export default class CustomIntroSlider extends React.Component<Props, State> {

    state = {
        currentSlide: 0,
    }

    sliderRef: { current: null | AppIntroSlider };

    introSlides: Array<Slide>;
    updateSlides: Array<Slide>;
    aprilFoolsSlides: Array<Slide>;
    currentSlides: Array<Slide>;

    /**
     * Generates intro slides
     */
    constructor() {
        super();
        this.sliderRef = React.createRef();
        this.introSlides = [
            {
                key: '0', // Mascot
                title: i18n.t('intro.slideMain.title'),
                text: i18n.t('intro.slideMain.text'),
                view: this.getWelcomeView,
                mascotStyle: MASCOT_STYLE.NORMAL,
                colors: ['#be1522', '#57080e'],
            },
            {
                key: '1',
                title: i18n.t('intro.slidePlanex.title'),
                text: i18n.t('intro.slidePlanex.text'),
                view: () => this.getIconView("calendar-clock"),
                mascotStyle: MASCOT_STYLE.INTELLO,
                colors: ['#be1522', '#57080e'],
            },
            {
                key: '2',
                title: i18n.t('intro.slideEvents.title'),
                text: i18n.t('intro.slideEvents.text'),
                view: () => this.getIconView("calendar-star",),
                mascotStyle: MASCOT_STYLE.HAPPY,
                colors: ['#be1522', '#57080e'],
            },
            {
                key: '3',
                title: i18n.t('intro.slideServices.title'),
                text: i18n.t('intro.slideServices.text'),
                view: () => this.getIconView("view-dashboard-variant",),
                mascotStyle: MASCOT_STYLE.CUTE,
                colors: ['#be1522', '#57080e'],
            },
            {
                key: '4',
                title: i18n.t('intro.slideDone.title'),
                text: i18n.t('intro.slideDone.text'),
                view: () => this.getIconView("account-heart",),
                mascotStyle: MASCOT_STYLE.COOL,
                colors: ['#9c165b', '#3e042b'],
            },
        ];
        this.updateSlides = [];
        for (let i = 0; i < Update.slidesNumber; i++) {
            this.updateSlides.push(
                {
                    key: i.toString(),
                    title: Update.getInstance().titleList[i],
                    text: Update.getInstance().descriptionList[i],
                    icon: Update.iconList[i],
                    colors: Update.colorsList[i],
                },
            );
        }

        this.aprilFoolsSlides = [
            {
                key: '1',
                title: i18n.t('intro.aprilFoolsSlide.title'),
                text: i18n.t('intro.aprilFoolsSlide.text'),
                view: () => <View/>,
                mascotStyle: MASCOT_STYLE.NORMAL,
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
    getIntroRenderItem = ({item, dimensions}: { item: Slide, dimensions: { width: number, height: number } }) => {
        const index = parseInt(item.key);
        return (
            <LinearGradient
                style={[
                    styles.mainContent,
                    dimensions
                ]}
                colors={item.colors}
                start={{x: 0, y: 0.1}}
                end={{x: 0.1, y: 1}}
            >
                {this.state.currentSlide === index
                    ? <View style={{height: "100%", flex: 1}}>
                        <View style={{flex: 1}}>
                            {item.view()}
                        </View>
                        <Animatable.View
                            animation={"fadeIn"}>
                            {index !== 0
                                ? <Animatable.View
                                    animation={"pulse"}
                                    iterationCount={"infinite"}
                                    duration={2000}
                                    style={{
                                        marginLeft: 30,
                                        marginBottom: 0,
                                        width: 80
                                    }}>
                                    <Mascot emotion={item.mascotStyle} size={80}/>
                                </Animatable.View> : null}

                            <View style={{
                                marginLeft: 50,
                                width: 0,
                                height: 0,
                                borderLeftWidth: 20,
                                borderRightWidth: 0,
                                borderBottomWidth: 20,
                                borderStyle: 'solid',
                                backgroundColor: 'transparent',
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderBottomColor: "rgba(0,0,0,0.60)",
                            }}/>
                            <Card style={{
                                backgroundColor: "rgba(0,0,0,0.38)",
                                marginHorizontal: 20,
                                borderColor: "rgba(0,0,0,0.60)",
                                borderWidth: 4,
                                borderRadius: 10,
                            }}>
                                <Card.Content>
                                    <Animatable.Text
                                        animation={"fadeIn"}
                                        delay={100}
                                        style={styles.title}>
                                        {item.title}
                                    </Animatable.Text>
                                    <Animatable.Text
                                        animation={"fadeIn"}
                                        delay={200}
                                        style={styles.text}>
                                        {item.text}
                                    </Animatable.Text>
                                </Card.Content>
                            </Card>
                        </Animatable.View>
                    </View> : null}
            </LinearGradient>
        );
    }

    getWelcomeView = () => {
        return (
            <View style={{flex: 1}}>
                <View
                    style={styles.center}>
                    <Mascot
                        size={250}
                        emotion={MASCOT_STYLE.NORMAL}
                        animated={true}
                        entryAnimation={{
                            animation: "bounceIn",
                            duration: 2000,
                        }}
                    />
                </View>
            </View>
        )
    }

    getIconView(icon: MaterialCommunityIconsGlyphs) {
        return (
            <View style={{flex: 1}}>
                <Animatable.View
                    style={styles.center}
                    animation={"fadeIn"}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        color={'#fff'}
                        size={200}/>
                </Animatable.View>
            </View>
        )
    }

    setStatusBarColor(color: string) {
        if (Platform.OS === 'android')
            StatusBar.setBackgroundColor(color, true);
    }

    onSlideChange = (index: number, lastIndex: number) => {
        this.setStatusBarColor(this.currentSlides[index].colors[0]);
        this.setState({currentSlide: index});
    };

    onSkip = () => {
        this.setStatusBarColor(this.currentSlides[this.currentSlides.length - 1].colors[0]);
        if (this.sliderRef.current != null)
            this.sliderRef.current.goToSlide(this.currentSlides.length - 1);
    }

    onDone = () => {
        this.setStatusBarColor(ThemeManager.getCurrentTheme().colors.surface);
        this.props.onDone();
    }

    renderNextButton = () => {
        return (
            <Animatable.View
                animation={"fadeIn"}

                style={{
                    borderRadius: 25,
                    padding: 5,
                    backgroundColor: "rgba(0,0,0,0.2)"
                }}>
                <MaterialCommunityIcons
                    name={"arrow-right"}
                    color={'#fff'}
                    size={40}/>
            </Animatable.View>
        )
    }

    renderDoneButton = () => {
        return (
            <Animatable.View
                animation={"bounceIn"}

                style={{
                    borderRadius: 25,
                    padding: 5,
                    backgroundColor: "rgb(190,21,34)"
                }}>
                <MaterialCommunityIcons
                    name={"check"}
                    color={'#fff'}
                    size={40}/>
            </Animatable.View>
        )
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
                data={this.currentSlides}
                extraData={this.state.currentSlide}

                renderItem={this.getIntroRenderItem}
                renderNextButton={this.renderNextButton}
                renderDoneButton={this.renderDoneButton}

                onDone={this.onDone}
                onSlideChange={this.onSlideChange}
                onSkip={this.onSkip}
            />
        );
    }

}


const styles = StyleSheet.create({
    mainContent: {
        paddingBottom: 100,
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
    center: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 'auto',
        marginLeft: 'auto',
    }
});
