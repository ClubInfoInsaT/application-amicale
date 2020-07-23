// @flow

import * as React from 'react';
import {RefreshControl, View} from "react-native";
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {getTimeOnlyString, stringToDate} from "../../utils/Planning";
import VoteTease from "../../components/Amicale/Vote/VoteTease";
import VoteSelect from "../../components/Amicale/Vote/VoteSelect";
import VoteResults from "../../components/Amicale/Vote/VoteResults";
import VoteWait from "../../components/Amicale/Vote/VoteWait";
import {StackNavigationProp} from "@react-navigation/stack";
import i18n from "i18n-js";
import {MASCOT_STYLE} from "../../components/Mascot/Mascot";
import MascotPopup from "../../components/Mascot/MascotPopup";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import {Button} from "react-native-paper";
import VoteNotAvailable from "../../components/Amicale/Vote/VoteNotAvailable";
import CollapsibleFlatList from "../../components/Collapsible/CollapsibleFlatList";

export type team = {
    id: number,
    name: string,
    votes: number,
}

type teamResponse = {
    has_voted: boolean,
    teams: Array<team>,
};

type stringVoteDates = {
    date_begin: string,
    date_end: string,
    date_result_begin: string,
    date_result_end: string,
}

type objectVoteDates = {
    date_begin: Date,
    date_end: Date,
    date_result_begin: Date,
    date_result_end: Date,
}

// const FAKE_DATE = {
//     "date_begin": "2020-08-19 15:50",
//     "date_end": "2020-08-19 15:50",
//     "date_result_begin": "2020-08-19 19:50",
//     "date_result_end": "2020-08-19 22:50",
// };
//
// const FAKE_DATE2 = {
//     "date_begin": null,
//     "date_end": null,
//     "date_result_begin": null,
//     "date_result_end": null,
// };
//
// const FAKE_TEAMS = {
//     has_voted: false,
//     teams: [
//         {
//             id: 1,
//             name: "TEST TEAM1",
//         },
//         {
//             id: 2,
//             name: "TEST TEAM2",
//         },
//     ],
// };
// const FAKE_TEAMS2 = {
//     has_voted: false,
//     teams: [
//         {
//             id: 1,
//             name: "TEST TEAM1",
//             votes: 9,
//         },
//         {
//             id: 2,
//             name: "TEST TEAM2",
//             votes: 9,
//         },
//         {
//             id: 3,
//             name: "TEST TEAM3",
//             votes: 5,
//         },
//     ],
// };

const MIN_REFRESH_TIME = 5 * 1000;

type Props = {
    navigation: StackNavigationProp
}

type State = {
    hasVoted: boolean,
    mascotDialogVisible: boolean,
}

/**
 * Screen displaying vote information and controls
 */
export default class VoteScreen extends React.Component<Props, State> {

    state = {
        hasVoted: false,
        mascotDialogVisible: AsyncStorageManager.getBool(AsyncStorageManager.PREFERENCES.voteShowBanner.key),
    };

    teams: Array<team>;
    hasVoted: boolean;
    datesString: null | stringVoteDates;
    dates: null | objectVoteDates;

    today: Date;

    mainFlatListData: Array<{ key: string }>;
    lastRefresh: Date | null;

    authRef: { current: null | AuthenticatedScreen };

    constructor() {
        super();
        this.hasVoted = false;
        this.today = new Date();
        this.authRef = React.createRef();
        this.lastRefresh = null;
        this.mainFlatListData = [
            {key: 'main'},
            {key: 'info'},
        ]
    }

    /**
     * Reloads vote data if last refresh delta is smaller than the minimum refresh time
     */
    reloadData = () => {
        let canRefresh;
        const lastRefresh = this.lastRefresh;
        if (lastRefresh != null)
            canRefresh = (new Date().getTime() - lastRefresh.getTime()) > MIN_REFRESH_TIME;
        else
            canRefresh = true;
        if (canRefresh && this.authRef.current != null)
            this.authRef.current.reload()
    };

    /**
     * Generates the objects containing string and Date representations of key vote dates
     */
    generateDateObject() {
        const strings = this.datesString;
        if (strings != null) {
            const dateBegin = stringToDate(strings.date_begin);
            const dateEnd = stringToDate(strings.date_end);
            const dateResultBegin = stringToDate(strings.date_result_begin);
            const dateResultEnd = stringToDate(strings.date_result_end);
            if (dateBegin != null && dateEnd != null && dateResultBegin != null && dateResultEnd != null) {
                this.dates = {
                    date_begin: dateBegin,
                    date_end: dateEnd,
                    date_result_begin: dateResultBegin,
                    date_result_end: dateResultEnd,
                };
            } else
                this.dates = null;
        } else
            this.dates = null;
    }

    /**
     * Gets the string representation of the given date.
     *
     * If the given date is the same day as today, only return the tile.
     * Otherwise, return the full date.
     *
     * @param date The Date object representation of the wanted date
     * @param dateString The string representation of the wanted date
     * @returns {string}
     */
    getDateString(date: Date, dateString: string): string {
        if (this.today.getDate() === date.getDate()) {
            const str = getTimeOnlyString(dateString);
            return str != null ? str : "";
        } else
            return dateString;
    }

    isVoteRunning() {
        return this.dates != null && this.today > this.dates.date_begin && this.today < this.dates.date_end;
    }

    isVoteStarted() {
        return this.dates != null && this.today > this.dates.date_begin;
    }

    isResultRunning() {
        return this.dates != null && this.today > this.dates.date_result_begin && this.today < this.dates.date_result_end;
    }

    isResultStarted() {
        return this.dates != null && this.today > this.dates.date_result_begin;
    }

    mainRenderItem = ({item}: { item: { key: string } }) => {
        if (item.key === 'info')
            return (
                <View>
                    <Button
                        mode={"contained"}
                        icon={"help-circle"}
                        onPress={this.showMascotDialog}
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: 20
                        }}>
                        {i18n.t("screens.vote.mascotDialog.title")}
                    </Button>
                </View>
            );
        else
            return this.getContent();
    };

    getScreen = (data: Array<{ [key: string]: any } | null>) => {
        // data[0] = FAKE_TEAMS2;
        // data[1] = FAKE_DATE;
        this.lastRefresh = new Date();

        const teams: teamResponse | null = data[0];
        const dateStrings: stringVoteDates | null = data[1];

        if (dateStrings != null && dateStrings.date_begin == null)
            this.datesString = null;
        else
            this.datesString = dateStrings;

        if (teams != null) {
            this.teams = teams.teams;
            this.hasVoted = teams.has_voted;
        }

        this.generateDateObject();
        return (
            <CollapsibleFlatList
                data={this.mainFlatListData}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this.reloadData}
                    />
                }
                extraData={this.state.hasVoted.toString()}
                renderItem={this.mainRenderItem}
            />
        );
    };

    getContent() {
        if (!this.isVoteStarted())
            return this.getTeaseVoteCard();
        else if (this.isVoteRunning() && (!this.hasVoted && !this.state.hasVoted))
            return this.getVoteCard();
        else if (!this.isResultStarted())
            return this.getWaitVoteCard();
        else if (this.isResultRunning())
            return this.getVoteResultCard();
        else
            return <VoteNotAvailable/>;
    }

    onVoteSuccess = () => this.setState({hasVoted: true});

    /**
     * The user has not voted yet, and the votes are open
     */
    getVoteCard() {
        return <VoteSelect teams={this.teams} onVoteSuccess={this.onVoteSuccess} onVoteError={this.reloadData}/>;
    }

    /**
     * Votes have ended, results can be displayed
     */
    getVoteResultCard() {
        if (this.dates != null && this.datesString != null)
            return <VoteResults
                teams={this.teams}
                dateEnd={this.getDateString(
                    this.dates.date_result_end,
                    this.datesString.date_result_end)}
            />;
        else
            return <VoteNotAvailable/>;
    }

    /**
     * Vote will open shortly
     */
    getTeaseVoteCard() {
        if (this.dates != null && this.datesString != null)
            return <VoteTease
                startDate={this.getDateString(this.dates.date_begin, this.datesString.date_begin)}/>;
        else
            return <VoteNotAvailable/>;
    }

    /**
     * Votes have ended, or user has voted waiting for results
     */
    getWaitVoteCard() {
        let startDate = null;
        if (this.dates != null && this.datesString != null && this.dates.date_result_begin != null)
            startDate = this.getDateString(this.dates.date_result_begin, this.datesString.date_result_begin);
        return <VoteWait startDate={startDate} hasVoted={this.hasVoted || this.state.hasVoted}
                         justVoted={this.state.hasVoted}
                         isVoteRunning={this.isVoteRunning()}/>;
    }

    showMascotDialog = () => {
        this.setState({mascotDialogVisible: true})
    };

    hideMascotDialog = () => {
        AsyncStorageManager.set(AsyncStorageManager.PREFERENCES.voteShowBanner.key, false);
        this.setState({mascotDialogVisible: false})
    };

    /**
     * Renders the authenticated screen.
     *
     * Teams and dates are not mandatory to allow showing the information box even if api requests fail
     *
     * @returns {*}
     */
    render() {
        return (
            <View style={{flex: 1}}>
                <AuthenticatedScreen
                    {...this.props}
                    ref={this.authRef}
                    requests={[
                        {
                            link: 'elections/teams',
                            params: {},
                            mandatory: false,
                        },
                        {
                            link: 'elections/dates',
                            params: {},
                            mandatory: false,
                        },
                    ]}
                    renderFunction={this.getScreen}
                />
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.vote.mascotDialog.title")}
                    message={i18n.t("screens.vote.mascotDialog.message")}
                    icon={"vote"}
                    buttons={{
                        action: null,
                        cancel: {
                            message: i18n.t("screens.vote.mascotDialog.button"),
                            icon: "check",
                            onPress: this.hideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.CUTE}
                />
            </View>
        );
    }
}
