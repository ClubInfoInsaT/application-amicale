// @flow

import * as React from 'react';
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {CommonActions} from "@react-navigation/native";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
}
const BIB_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/50695561_2124263197597162_2325349608210825216_n.jpg?_nc_cat=109&_nc_sid=8bfeb9&_nc_ohc=tmcV6FWO7_kAX9vfWHU&_nc_ht=scontent-cdg2-1.xx&oh=3b81c76e46b49f7c3a033ea3b07ec212&oe=5EC59B4D";
const RU_IMAGE = "https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/47123773_2041883702501779_5289372776166064128_o.jpg?_nc_cat=100&_nc_sid=cdbe9c&_nc_ohc=dpuBGlIIy_EAX8CyC0l&_nc_ht=scontent-cdg2-1.xx&oh=5c5bb4f0c7f12b554246f7c9b620a5f3&oe=5EC4DB31";
const ROOM_IMAGE = "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/47041013_2043521689004647_316124496522117120_n.jpg?_nc_cat=103&_nc_sid=8bfeb9&_nc_ohc=bIp8OVJvvSEAX8mKnDZ&_nc_ht=scontent-cdt1-1.xx&oh=b4fef72a645804a849ad30e9e20fca12&oe=5EC29309";
const EMAIL_IMAGE = "https://etud-mel.insa-toulouse.fr/webmail/images/logo-bluemind.png";
const ENT_IMAGE = "https://ent.insa-toulouse.fr/media/org/jasig/portal/layout/tab-column/xhtml-theme/insa/institutional/LogoInsa.png";

const PROXIMO_IMAGE = require("../../../assets/proximo-logo.png");
const WIKETUD_LINK = "https://wiki.etud.insa-toulouse.fr/resources/assets/wiketud.png?ff051";
const AMICALE_IMAGE = require("../../../assets/amicale.png");
const EE_IMAGE = "https://etud.insa-toulouse.fr/~eeinsat/wp-content/uploads/2019/09/logo-blanc.png";
const TUTORINSA_IMAGE = "https://www.etud.insa-toulouse.fr/~tutorinsa/public/images/logo-gray.png";

type listItem = {
    title: string,
    description: string,
    image: string | number,
    content: cardList,
}

class ServicesSectionScreen extends React.Component<Props> {

    finalDataset: listItem;

    constructor(props) {
        super(props);
        this.handleNavigationParams();
    }

    handleNavigationParams() {
        if (this.props.route.params != null) {
            if (this.props.route.params.data != null) {
                this.finalDataset = this.props.route.params.data;
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({data: null}));
            }
        }
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return <CardList
            dataset={this.finalDataset.content}
            isHorizontal={false}
            onScroll={onScroll}
            contentContainerStyle={{
                paddingTop: containerPaddingTop,
                paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
            }}
            scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
        />
    }
}

export default withCollapsible(ServicesSectionScreen);
