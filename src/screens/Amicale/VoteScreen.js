// @flow

import * as React from 'react';
import {FlatList, StyleSheet} from "react-native";
import {Avatar, Button, Card, Paragraph, RadioButton, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {stringToDate} from "../../utils/Planning";

const ICON_AMICALE = require('../../../assets/amicale.png');

type Props = {
    navigation: Object,
    theme: Object,
}

const FAKE_DATE = {
    "date_begin": "2020-04-06 13:00",
    "date_end": "2020-04-06 20:00",
    "date_result_begin": "2020-04-06 20:15",
    "date_result_end": "2020-04-07 12:00",
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
            name: "TEST TEAM",
        },
    ],
};

type State = {
    selectedTeam: string,
}

class VoteScreen extends React.Component<Props, State> {

    state = {
        selectedTeam: "0",
    };

    colors: Object;

    teams: Array<Object> | null;
    hasVoted: boolean;
    datesString: Object;
    dates: Object;

    today: Date;

    mainFlatListData: Array<Object>;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.hasVoted = false;
        this.teams = null;
        this.today = new Date();

        this.mainFlatListData = [
            {key: 'main'},
            {key: 'info'},
        ]
    }

    mainRenderItem = ({item}: Object) => {
        if (item.key === 'info')
            return this.getTitleCard();
        else if (item.key === 'main' && this.isVoteAvailable())
            return this.getContent();
        else
            return null;
    };

    getScreen = (data: Array<Object>) => {
        data[0] = FAKE_TEAMS;
        data[1] = FAKE_DATE;

        if (data[0] !== null) {
            this.teams = data[0].teams;
            this.hasVoted = data[0].has_voted;
        }
        this.datesString = data[1];
        this.generateDateObject();
        console.log(this.teams);
        console.log(this.datesString);
        return (
            <FlatList
                data={this.mainFlatListData}
                extraData={this.state.selectedTeam}
                renderItem={this.mainRenderItem}
            />
        );
    };

    generateDateObject() {
        this.dates = {
            date_begin: stringToDate(this.datesString.date_begin),
            date_end: stringToDate(this.datesString.date_end),
            date_result_begin: stringToDate(this.datesString.date_result_begin),
            date_result_end: stringToDate(this.datesString.date_result_end),
        };
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

    getContent() {
        if (!this.isVoteStarted())
            return this.getTeaseVoteCard();
        else if (this.isVoteRunning() && !this.hasVoted)
            return this.getVoteCard();
        else if (!this.isResultStarted())
            return this.getWaitVoteCard();
        else if (this.isResultRunning())
            return this.getVoteResultCard();
        else
            return null;
    }

    getTitleCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE"}
                    subtitle={"WHY"}
                    left={(props) => <Avatar.Image
                        {...props}
                        source={ICON_AMICALE}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rhoncus porttitor
                        suscipit. Quisque hendrerit, quam id vestibulum vestibulum, lorem nisi hendrerit nisi, a
                        eleifend sapien diam ut elit. Curabitur sit amet vulputate lectus. Donec semper cursus sapien
                        vel finibus.
                    </Paragraph>
                    <Paragraph>
                        Sed et venenatis turpis. Fusce malesuada magna urna, sed vehicula sem luctus in. Vivamus
                        faucibus vel eros a ultricies. In sed laoreet ante, luctus mattis tellus. Etiam vitae ipsum
                        sagittis, consequat purus sed, blandit risus.
                    </Paragraph>
                </Card.Content>
            </Card>
        );
    }

    onVoteSelectionChange = (team: string) => {
        this.setState({selectedTeam: team})
    };

    onVotePress = () => {
        console.log("vote sent");
    };

    /**
     * The user has not voted yet, and the votes are open
     */
    getVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE OPEN"}
                    subtitle={"VOTE NOW"}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon={"alert-decagram"}
                    />}
                />
                <Card.Content>
                    <RadioButton.Group
                        onValueChange={this.onVoteSelectionChange}
                        value={this.state.selectedTeam}
                    >
                        <FlatList
                            data={this.teams}
                            keyExtractor={this.voteKeyExtractor}
                            extraData={this.state.selectedTeam}
                            renderItem={this.voteRenderItem}
                        />
                    </RadioButton.Group>
                </Card.Content>
                <Card.Actions>
                    <Button
                        icon="send"
                        mode="contained"
                        onPress={this.onVotePress}
                        style={{marginLeft: 'auto'}}>
                        SEND VOTE
                    </Button>
                </Card.Actions>
            </Card>
        );
    }

    voteKeyExtractor = (item: Object) => item.id.toString();

    voteRenderItem = ({item}: Object) => {
        return <RadioButton.Item label={item.name} value={item.id.toString()}/>
    };

    /**
     * Votes have ended, results can be displayed
     */
    getVoteResultCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"getVoteResultCard"}
                    subtitle={"getVoteResultCard"}
                />
                <Card.Content>
                    <Paragraph>TEAM1</Paragraph>
                    <Paragraph>TEAM2</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    /**
     * Vote will open shortly
     */
    getTeaseVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"getTeaseVoteCard"}
                    subtitle={"getTeaseVoteCard"}
                />
                <Card.Content>
                </Card.Content>
            </Card>
        );
    }

    /**
     * User has voted, waiting for results
     */
    getWaitVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"getWaitVoteCard"}
                    subtitle={"getWaitVoteCard"}
                />
                <Card.Content>
                </Card.Content>
            </Card>
        );
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
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

const styles = StyleSheet.create({
    card: {
        margin: 10,
    },
    icon: {
        backgroundColor: 'transparent'
    },
});

export default withTheme(VoteScreen);
