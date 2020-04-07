// @flow

import * as React from 'react';
import {FlatList, View} from "react-native";
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {getTimeOnlyString, stringToDate} from "../../utils/Planning";
import VoteTitle from "../../components/Amicale/Vote/VoteTitle";
import VoteTease from "../../components/Amicale/Vote/VoteTease";
import VoteSelect from "../../components/Amicale/Vote/VoteSelect";
import VoteResults from "../../components/Amicale/Vote/VoteResults";
import VoteWait from "../../components/Amicale/Vote/VoteWait";

const FAKE_DATE = {
    "date_begin": "2020-04-06 21:50",
    "date_end": "2020-04-07 23:50",
    "date_result_begin": "2020-04-07 21:50",
    "date_result_end": "2020-04-07 22:50",
};

const FAKE_DATE2 = {
    "date_begin": null,
    "date_end": null,
    "date_result_begin": null,
    "date_result_end": null,
};

const FAKE_TEAMS = {
    has_voted: false,
    teams: [
        {
            id: 1,
            name: "TEST TEAM1",
        },
        {
            id: 2,
            name: "TEST TEAM2",
        },
    ],
};
const FAKE_TEAMS2 = {
    has_voted: false,
    teams: [
        {
            id: 1,
            name: "TEST TEAM1",
            votes: 1,
        },
        {
            id: 2,
            name: "TEST TEAM2",
            votes: 9,
        },
    ],
};

type Props = {}

type State = {
    hasVoted: boolean,
}

export default class VoteScreen extends React.Component<Props, State> {

    state = {
        hasVoted: false,
    };

    teams: Array<Object>;
    hasVoted: boolean;
    datesString: Object;
    dates: Object;

    today: Date;

    mainFlatListData: Array<Object>;

    authRef: Object;

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

    reloadData = () => this.authRef.current.reload();

    generateDateObject() {
        this.dates = {
            date_begin: stringToDate(this.datesString.date_begin),
            date_end: stringToDate(this.datesString.date_end),
            date_result_begin: stringToDate(this.datesString.date_result_begin),
            date_result_end: stringToDate(this.datesString.date_result_end),
        };
    }

    getDateString(date: Date, dateString: string): string {
        if (this.today.getDate() === date.getDate()) {
            const str = getTimeOnlyString(dateString);
            return str !== null ? str : "";
        } else
            return dateString;
    }

    isVoteAvailable() {
        return this.dates.date_begin !== null;
    }

    isVoteRunning() {
        return this.today > this.dates.date_begin && this.today < this.dates.date_end;
    }

    isVoteStarted() {
        return this.today > this.dates.date_begin;
    }

    isResultRunning() {
        return this.today > this.dates.date_result_begin && this.today < this.dates.date_result_end;
    }

    isResultStarted() {
        return this.today > this.dates.date_result_begin;
    }

    mainRenderItem = ({item}: Object) => {
        if (item.key === 'info')
            return <VoteTitle/>;
        else if (item.key === 'main' && this.isVoteAvailable())
            return this.getContent();
        else
            return null;
    };

    getScreen = (data: Array<Object>) => {
        data[0] = FAKE_TEAMS2;
        data[1] = FAKE_DATE;

        if (data[0] !== null) {
            this.teams = data[0].teams;
            this.hasVoted = data[0].has_voted;
        }
        this.datesString = data[1];
        this.generateDateObject();
        return (
            <View>
                {/*$FlowFixMe*/}
                <FlatList
                    data={this.mainFlatListData}
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
        return <VoteResults teams={this.teams}
                            dateEnd={this.getDateString(this.dates.date_result_end, this.datesString.date_result_end)}/>;
    }

    /**
     * Vote will open shortly
     */
    getTeaseVoteCard() {
        return <VoteTease startDate={this.getDateString(this.dates.date_begin, this.datesString.date_begin)}/>;
    }

    /**
     * Votes have ended, or user has voted waiting for results
     */
    getWaitVoteCard() {
        let startDate = null;
        if (this.dates.date_result_begin !== null)
            startDate = this.getDateString(this.dates.date_result_begin, this.datesString.date_result_begin);
        return <VoteWait startDate={startDate} hasVoted={this.hasVoted} justVoted={this.state.hasVoted}
                         isVoteRunning={this.isVoteRunning()}/>;
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                ref={this.authRef}
                links={[
                    {
                        link: 'elections/teams',
                        mandatory: false,
                    },
                    {
                        link: 'elections/datesString',
                        mandatory: false,
                    },
                ]}
                renderFunction={this.getScreen}
            />
        );
    }
}
