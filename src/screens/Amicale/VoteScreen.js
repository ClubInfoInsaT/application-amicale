// @flow

import * as React from 'react';
import {FlatList, RefreshControl, View} from "react-native";
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {getTimeOnlyString, stringToDate} from "../../utils/Planning";
import VoteTitle from "../../components/Amicale/Vote/VoteTitle";
import VoteTease from "../../components/Amicale/Vote/VoteTease";
import VoteSelect from "../../components/Amicale/Vote/VoteSelect";
import VoteResults from "../../components/Amicale/Vote/VoteResults";
import VoteWait from "../../components/Amicale/Vote/VoteWait";

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
//     "date_begin": "2020-04-19 15:50",
//     "date_end": "2020-04-19 15:50",
//     "date_result_begin": "2020-04-19 19:50",
//     "date_result_end": "2020-04-19 22:50",
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
    navigation: Object
}

type State = {
    hasVoted: boolean,
}

export default class VoteScreen extends React.Component<Props, State> {

    state = {
        hasVoted: false,
    };

    teams: Array<team>;
    hasVoted: boolean;
    datesString: null | stringVoteDates;
    dates: null | objectVoteDates;

    today: Date;

    mainFlatListData: Array<{ key: string }>;
    lastRefresh: Date;

    authRef: { current: null | AuthenticatedScreen };

    constructor() {
        super();
        this.hasVoted = false;
        this.today = new Date();
        this.authRef = React.createRef();
        this.mainFlatListData = [
            {key: 'main'},
            {key: 'info'},
        ]
    }

    reloadData = () => {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) > MIN_REFRESH_TIME;
        else
            canRefresh = true;
        if (canRefresh && this.authRef.current != null)
            this.authRef.current.reload()
    };

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

    mainRenderItem = ({item}: Object) => {
        if (item.key === 'info')
            return <VoteTitle/>;
        else if (item.key === 'main' && this.dates != null)
            return this.getContent();
        else
            return null;
    };

    getScreen = (data: Array<{ [key: string]: any } | null>) => {
        // data[0] = FAKE_TEAMS2;
        // data[1] = FAKE_DATE;
        this.lastRefresh = new Date();

        const teams : teamResponse | null = data[0];
        const dateStrings : stringVoteDates | null = data[1];

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
            <View>
                {/*$FlowFixMe*/}
                <FlatList
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
            </View>
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
            return null;
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
            return null;
    }

    /**
     * Vote will open shortly
     */
    getTeaseVoteCard() {
        if (this.dates != null && this.datesString != null)
            return <VoteTease
                startDate={this.getDateString(this.dates.date_begin, this.datesString.date_begin)}/>;
        else
            return null;
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

    render() {
        return (
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
        );
    }
}
