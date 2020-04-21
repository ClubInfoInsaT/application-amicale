// @flow

import * as React from 'react';
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../utils/withCollapsible";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
}

type State = {}

const BIB_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/50695561_2124263197597162_2325349608210825216_n.jpg?_nc_cat=109&_nc_sid=8bfeb9&_nc_ohc=tmcV6FWO7_kAX9vfWHU&_nc_ht=scontent-cdg2-1.xx&oh=3b81c76e46b49f7c3a033ea3b07ec212&oe=5EC59B4D";
const RU_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/47123773_2041883702501779_5289372776166064128_o.jpg?_nc_cat=100&_nc_sid=cdbe9c&_nc_ohc=dpuBGlIIy_EAX8CyC0l&_nc_ht=scontent-cdg2-1.xx&oh=5c5bb4f0c7f12b554246f7c9b620a5f3&oe=5EC4DB31";
const ROOM_IMAGE = "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/47041013_2043521689004647_316124496522117120_n.jpg?_nc_cat=103&_nc_sid=8bfeb9&_nc_ohc=bIp8OVJvvSEAX8mKnDZ&_nc_ht=scontent-cdt1-1.xx&oh=b4fef72a645804a849ad30e9e20fca12&oe=5EC29309";
const EMAIL_IMAGE = "https://etud-mel.insa-toulouse.fr/webmail/images/logo-bluemind.png";
const ENT_IMAGE = "https://ent.insa-toulouse.fr/media/org/jasig/portal/layout/tab-column/xhtml-theme/insa/institutional/LogoInsa.png";

export type cardItem = {
    title: string,
    subtitle: string,
    image: string | number,
    onPress: () => void,
};

export type cards = Array<cardItem>;


class InsaHomeScreen extends React.Component<Props, State> {

    state = {};

    dataset: Array<cards>;

    constructor(props: Props) {
        super(props);
        const nav = props.navigation;
        this.dataset = [
            [
                {
                    title: "RU",
                    subtitle: "the ru",
                    image: RU_IMAGE,
                    onPress: () => nav.navigate("self-menu"),
                },
            ],
            [
                {
                    title: "AVAILABLE ROOMS",
                    subtitle: "ROOMS",
                    image: ROOM_IMAGE,
                    onPress: () => nav.navigate("available-rooms"),
                },
                {
                    title: "BIB",
                    subtitle: "BIB",
                    image: BIB_IMAGE,
                    onPress: () => nav.navigate("bib"),
                },
            ],
            [
                {
                    title: "EMAIL",
                    subtitle: "EMAIL",
                    image: EMAIL_IMAGE,
                    onPress: () => nav.navigate("available-rooms"),
                },
                {
                    title: "ENT",
                    subtitle: "ENT",
                    image: ENT_IMAGE,
                    onPress: () => nav.navigate("bib"),
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

export default withCollapsible(InsaHomeScreen);