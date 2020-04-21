// @flow

import * as React from 'react';
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import type {cards} from "../Insa/InsaHomeScreen";
import {Collapsible} from "react-navigation-collapsible";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
}

const PROXIMO_IMAGE = require("../../../assets/proximo-logo.png");
const WIKETUD_LINK = "https://wiki.etud.insa-toulouse.fr/resources/assets/wiketud.png?ff051";
const AMICALE_IMAGE = require("../../../assets/amicale.png");
const EE_IMAGE = "https://etud.insa-toulouse.fr/~eeinsat/wp-content/uploads/2019/09/logo-blanc.png";
const TUTORINSA_IMAGE = "https://www.etud.insa-toulouse.fr/~tutorinsa/public/images/logo-gray.png";
const PLANNING_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/89719124_1737599216391004_5007805161305800704_o.jpg?_nc_cat=102&_nc_sid=825194&_nc_ohc=04zvPRn2SzIAX8v3F4q&_nc_ht=scontent-cdg2-1.xx&oh=ecc4af602818481c4192c92b8a45c69b&oe=5EC355E2";

class WebsitesHomeScreen extends React.Component<Props> {

    dataset: Array<cards>;

    constructor(props) {
        super(props);
        const nav = props.navigation;
        this.dataset = [
            [
                {
                    title: "proximo",
                    subtitle: "proximo",
                    image: PROXIMO_IMAGE,
                    onPress: () => nav.navigate("proximo"),
                },
                {
                    title: "planning",
                    subtitle: "planning",
                    image: PLANNING_IMAGE,
                    onPress: () => nav.navigate("planning"),
                },
            ],
            [
                {
                    title: "AMICALE",
                    subtitle: "AMICALE",
                    image: AMICALE_IMAGE,
                    onPress: () => nav.navigate("amicale-website"),
                },
                {
                    title: "wiketud",
                    subtitle: "wiketud",
                    image: WIKETUD_LINK,
                    onPress: () => nav.navigate("wiketud"),
                },
            ],
            [
                {
                    title: "ELUS ETUDIANTS",
                    subtitle: "ELUS ETUDIANTS",
                    image: EE_IMAGE,
                    onPress: () => nav.navigate("elus-etudiants"),
                },
                {
                    title: "TUTOR INSA",
                    subtitle: "TUTOR INSA",
                    image: TUTORINSA_IMAGE,
                    onPress: () => nav.navigate("tutor-insa"),
                },
            ],
        ];
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <CardList
                dataset={this.dataset}
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingTop: containerPaddingTop,
                    paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
                }}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            />
        );
    }
}

export default withCollapsible(WebsitesHomeScreen);
