// @flow

import color from "color";

import {Dimensions, PixelRatio, Platform} from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
    platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

export default {
    platformStyle,
    platform,

    //Accordion
    headerStyle: "#edebed",
    iconStyle: "#000",
    contentStyle: "#f5f4f5",
    expandedIconStyle: "#000",
    accordionBorderColor: "#d3d3d3",

    // Android
    androidRipple: true,
    androidRippleColor: "rgba(256, 256, 256, 0.3)",
    androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
    btnUppercaseAndroidText: true,

    // Badge
    badgeBg: "#ED1727",
    badgeColor: "#fff",
    badgePadding: platform === "ios" ? 3 : 0,

    // Button
    btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
    btnTextColor: '#fff',
    btnDisabledBg: "#b5b5b5",
    buttonPadding: 6,
    get btnPrimaryBg() {
        return this.brandPrimary;
    },
    get btnPrimaryColor() {
        return this.textColor;
    },
    get btnInfoBg() {
        return this.brandInfo;
    },
    get btnInfoColor() {
        return this.textColor;
    },
    get btnSuccessBg() {
        return this.brandSuccess;
    },
    get btnSuccessColor() {
        return this.textColor;
    },
    get btnDangerBg() {
        return this.brandDanger;
    },
    get btnDangerColor() {
        return this.textColor;
    },
    get btnWarningBg() {
        return this.brandWarning;
    },
    get btnWarningColor() {
        return this.textColor;
    },
    get btnTextSize() {
        return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
    },
    get btnTextSizeLarge() {
        return this.fontSizeBase * 1.5;
    },
    get btnTextSizeSmall() {
        return this.fontSizeBase * 0.8;
    },
    get borderRadiusLarge() {
        return this.fontSizeBase * 3.8;
    },
    get iconSizeLarge() {
        return this.iconFontSize * 1.5;
    },
    get iconSizeSmall() {
        return this.iconFontSize * 0.6;
    },

    // Card
    cardDefaultBg: "#363636",
    cardBorderColor: "#1a1a1a",
    cardBorderRadius: 2,
    cardItemPadding: platform === "ios" ? 10 : 12,

    // CheckBox
    CheckboxRadius: platform === "ios" ? 13 : 0,
    CheckboxBorderWidth: platform === "ios" ? 1 : 2,
    CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
    CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
    CheckboxIconSize: platform === "ios" ? 21 : 16,
    CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
    CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 17,
    checkboxBgColor: "#E4202D",
    checkboxSize: 20,
    checkboxTickColor: "#fff",

    // Color
    brandPrimary: platform === "ios" ? "#e42612" : "#e42612",
    brandInfo: "#62B1F6",
    brandSuccess: "#5cb85c",
    brandDanger: "#d9534f",
    brandWarning: "#f0ad4e",
    brandDark: "#000",
    brandLight: "#f4f4f4",

    //Container
    containerBgColor: "#333333",

    //Date Picker
    datePickerTextColor: "#fff",
    datePickerBg: "transparent",

    // Font
    DefaultFontSize: 16,
    fontFamily: platform === "ios" ? "System" : "Roboto",
    fontSizeBase: 15,
    get fontSizeH1() {
        return this.fontSizeBase * 1.8;
    },
    get fontSizeH2() {
        return this.fontSizeBase * 1.6;
    },
    get fontSizeH3() {
        return this.fontSizeBase * 1.4;
    },

    // Footer
    footerHeight: 55,
    footerDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
    footerPaddingBottom: 0,

    // FooterTab
    tabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
    tabBarTextSize: platform === "ios" ? 14 : 11,
    activeTab: platform === "ios" ? "#007aff" : "#fff",
    sTabBarActiveTextColor: "#007aff",
    tabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
    tabActiveBgColor: platform === "ios" ? "#cde1f9" : "#3F51B5",

    // Header
    toolbarBtnColor: platform === "ios" ? "#e42612" : "#fff",
    toolbarDefaultBg: platform === "ios" ? "#F8F8F8" : "#e42612",
    toolbarHeight: platform === "ios" ? 64 : 56,
    toolbarSearchIconSize: platform === "ios" ? 20 : 23,
    toolbarInputColor: platform === "ios" ? "#CECDD2" : "#fff",
    searchBarHeight: platform === "ios" ? 30 : 40,
    searchBarInputHeight: platform === "ios" ? 30 : 50,
    toolbarBtnTextColor: platform === "ios" ? "#e42612" : "#fff",
    toolbarDefaultBorder: platform === "ios" ? "#a7a6ab" : "#ba1f0f",
    iosStatusbar: platform === "ios" ? "dark-content" : "light-content",
    get statusBarColor() {
        return color(this.toolbarDefaultBg)
            .darken(0.2)
            .hex();
    },
    get darkenHeader() {
        return color(this.tabBgColor)
            .darken(0.03)
            .hex();
    },

    // Icon
    iconFamily: "Ionicons",
    iconFontSize: platform === "ios" ? 30 : 28,
    iconHeaderSize: platform === "ios" ? 33 : 24,

    // InputGroup
    inputFontSize: 17,
    inputBorderColor: "#D9D5DC",
    inputSuccessBorderColor: "#2b8339",
    inputErrorBorderColor: "#ed2f2f",
    inputHeightBase: 50,
    get inputColor() {
        return this.textColor;
    },
    get inputColorPlaceholder() {
        return "#575757";
    },

    // Line Height
    btnLineHeight: 19,
    lineHeightH1: 32,
    lineHeightH2: 27,
    lineHeightH3: 22,
    lineHeight: platform === "ios" ? 20 : 24,
    listItemSelected: platform === "ios" ? "#e42612" : "#e42612",

    // List
    listBg: "transparent",
    listBorderColor: "#727272",
    listDividerBg: "#f4f4f4",
    listBtnUnderlayColor: "#DDD",
    listItemPadding: platform === "ios" ? 10 : 12,
    listNoteColor: "#acacac",
    listNoteSize: 13,

    // Progress Bar
    defaultProgressColor: "#E4202D",
    inverseProgressColor: "#1A191B",

    // Radio Button
    radioBtnSize: platform === "ios" ? 25 : 23,
    radioSelectedColorAndroid: "#E4202D",
    radioBtnLineHeight: platform === "ios" ? 29 : 24,
    get radioColor() {
        return this.brandPrimary;
    },

    // Segment
    segmentBackgroundColor: platform === "ios" ? "#F8F8F8" : "#3F51B5",
    segmentActiveBackgroundColor: platform === "ios" ? "#007aff" : "#fff",
    segmentTextColor: platform === "ios" ? "#007aff" : "#fff",
    segmentActiveTextColor: platform === "ios" ? "#fff" : "#3F51B5",
    segmentBorderColor: platform === "ios" ? "#007aff" : "#fff",
    segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#3F51B5",

    // Spinner
    defaultSpinnerColor: "#e42612",
    inverseSpinnerColor: "#1A191B",

    // Tab
    tabDefaultBg: platform === "ios" ? "#2b2b2b" : "#e42612",
    topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
    topTabBarActiveTextColor: platform === "ios" ? "#e42612" : "#fff",
    topTabBarBorderColor: platform === "ios" ? "#a7a6ab" : "#fff",
    topTabBarActiveBorderColor: platform === "ios" ? "#e42612" : "#fff",

    // Tabs
    tabBgColor: "#2b2b2b",
    tabFontSize: 15,

    // Text
    textColor: "#d6d6d6",
    inverseTextColor: "#000",
    noteFontSize: 14,
    get defaultTextColor() {
        return this.textColor;
    },

    // Title
    titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
    titleFontSize: platform === "ios" ? 17 : 19,
    subTitleFontSize: platform === "ios" ? 11 : 14,
    subtitleColor: platform === "ios" ? "#8e8e93" : "#FFF",
    titleFontColor: platform === "ios" ? "#000" : "#FFF",


    // CUSTOM
    customMaterialIconColor: "#b3b3b3",
    fetchedDataSectionListErrorText: "#acacac",

    // PROXIWASH
    proxiwashFinishedColor: "rgba(17,149,32,0.53)",
    proxiwashReadyColor: "transparent",
    proxiwashRunningColor: "rgba(29,59,175,0.65)",
    proxiwashBrokenColor: "#000000",
    proxiwashErrorColor: "rgba(213,8,0,0.57)",


    // Other
    borderRadiusBase: platform === "ios" ? 5 : 2,
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    contentPadding: 10,
    dropdownLinkColor: "#414142",
    inputLineHeight: 24,
    deviceWidth,
    deviceHeight,
    isIphoneX,
    inputGroupRoundedBorderRadius: 30,

    //iPhoneX SafeArea
    Inset: {
        portrait: {
            topInset: 24,
            leftInset: 0,
            rightInset: 0,
            bottomInset: 34
        },
        landscape: {
            topInset: 0,
            leftInset: 44,
            rightInset: 44,
            bottomInset: 21
        }
    }
};
