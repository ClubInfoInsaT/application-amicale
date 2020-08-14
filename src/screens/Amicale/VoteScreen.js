// @flow

import * as React from 'react';
import {RefreshControl, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import i18n from 'i18n-js';
import {Button} from 'react-native-paper';
import AuthenticatedScreen from '../../components/Amicale/AuthenticatedScreen';
import {getTimeOnlyString, stringToDate} from '../../utils/Planning';
import VoteTease from '../../components/Amicale/Vote/VoteTease';
import VoteSelect from '../../components/Amicale/Vote/VoteSelect';
import VoteResults from '../../components/Amicale/Vote/VoteResults';
import VoteWait from '../../components/Amicale/Vote/VoteWait';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import VoteNotAvailable from '../../components/Amicale/Vote/VoteNotAvailable';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import type {ApiGenericDataType} from '../../utils/WebData';

export type VoteTeamType = {
  id: number,
  name: string,
  votes: number,
};

type TeamResponseType = {
  has_voted: boolean,
  teams: Array<VoteTeamType>,
};

type VoteDatesStringType = {
  date_begin: string,
  date_end: string,
  date_result_begin: string,
  date_result_end: string,
};

type VoteDatesObjectType = {
  date_begin: Date,
  date_end: Date,
  date_result_begin: Date,
  date_result_end: Date,
};

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

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  hasVoted: boolean,
  mascotDialogVisible: boolean,
};

/**
 * Screen displaying vote information and controls
 */
export default class VoteScreen extends React.Component<PropsType, StateType> {
  teams: Array<VoteTeamType>;

  hasVoted: boolean;

  datesString: null | VoteDatesStringType;

  dates: null | VoteDatesObjectType;

  today: Date;

  mainFlatListData: Array<{key: string}>;

  lastRefresh: Date | null;

  authRef: {current: null | AuthenticatedScreen};

  constructor() {
    super();
    this.state = {
      hasVoted: false,
      mascotDialogVisible: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.voteShowMascot.key,
      ),
    };
    this.hasVoted = false;
    this.today = new Date();
    this.authRef = React.createRef();
    this.lastRefresh = null;
    this.mainFlatListData = [{key: 'main'}, {key: 'info'}];
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
      return str != null ? str : '';
    }
    return dateString;
  }

  getMainRenderItem = ({item}: {item: {key: string}}): React.Node => {
    if (item.key === 'info')
      return (
        <View>
          <Button
            mode="contained"
            icon="help-circle"
            onPress={this.showMascotDialog}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
            }}>
            {i18n.t('screens.vote.mascotDialog.title')}
          </Button>
        </View>
      );
    return this.getContent();
  };

  getScreen = (data: Array<ApiGenericDataType | null>): React.Node => {
    const {state} = this;
    // data[0] = FAKE_TEAMS2;
    // data[1] = FAKE_DATE;
    this.lastRefresh = new Date();

    const teams: TeamResponseType | null = data[0];
    const dateStrings: VoteDatesStringType | null = data[1];

    if (dateStrings != null && dateStrings.date_begin == null)
      this.datesString = null;
    else this.datesString = dateStrings;

    if (teams != null) {
      this.teams = teams.teams;
      this.hasVoted = teams.has_voted;
    }

    this.generateDateObject();
    return (
      <CollapsibleFlatList
        data={this.mainFlatListData}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.reloadData} />
        }
        extraData={state.hasVoted.toString()}
        renderItem={this.getMainRenderItem}
      />
    );
  };

  getContent(): React.Node {
    const {state} = this;
    if (!this.isVoteStarted()) return this.getTeaseVoteCard();
    if (this.isVoteRunning() && !this.hasVoted && !state.hasVoted)
      return this.getVoteCard();
    if (!this.isResultStarted()) return this.getWaitVoteCard();
    if (this.isResultRunning()) return this.getVoteResultCard();
    return <VoteNotAvailable />;
  }

  onVoteSuccess = (): void => this.setState({hasVoted: true});

  /**
   * The user has not voted yet, and the votes are open
   */
  getVoteCard(): React.Node {
    return (
      <VoteSelect
        teams={this.teams}
        onVoteSuccess={this.onVoteSuccess}
        onVoteError={this.reloadData}
      />
    );
  }

  /**
   * Votes have ended, results can be displayed
   */
  getVoteResultCard(): React.Node {
    if (this.dates != null && this.datesString != null)
      return (
        <VoteResults
          teams={this.teams}
          dateEnd={this.getDateString(
            this.dates.date_result_end,
            this.datesString.date_result_end,
          )}
        />
      );
    return <VoteNotAvailable />;
  }

  /**
   * Vote will open shortly
   */
  getTeaseVoteCard(): React.Node {
    if (this.dates != null && this.datesString != null)
      return (
        <VoteTease
          startDate={this.getDateString(
            this.dates.date_begin,
            this.datesString.date_begin,
          )}
        />
      );
    return <VoteNotAvailable />;
  }

  /**
   * Votes have ended, or user has voted waiting for results
   */
  getWaitVoteCard(): React.Node {
    const {state} = this;
    let startDate = null;
    if (
      this.dates != null &&
      this.datesString != null &&
      this.dates.date_result_begin != null
    )
      startDate = this.getDateString(
        this.dates.date_result_begin,
        this.datesString.date_result_begin,
      );
    return (
      <VoteWait
        startDate={startDate}
        hasVoted={this.hasVoted || state.hasVoted}
        justVoted={state.hasVoted}
        isVoteRunning={this.isVoteRunning()}
      />
    );
  }

  /**
   * Reloads vote data if last refresh delta is smaller than the minimum refresh time
   */
  reloadData = () => {
    let canRefresh;
    const {lastRefresh} = this;
    if (lastRefresh != null)
      canRefresh =
        new Date().getTime() - lastRefresh.getTime() > MIN_REFRESH_TIME;
    else canRefresh = true;
    if (canRefresh && this.authRef.current != null)
      this.authRef.current.reload();
  };

  showMascotDialog = () => {
    this.setState({mascotDialogVisible: true});
  };

  hideMascotDialog = () => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.voteShowMascot.key,
      false,
    );
    this.setState({mascotDialogVisible: false});
  };

  isVoteStarted(): boolean {
    return this.dates != null && this.today > this.dates.date_begin;
  }

  isResultRunning(): boolean {
    return (
      this.dates != null &&
      this.today > this.dates.date_result_begin &&
      this.today < this.dates.date_result_end
    );
  }

  isResultStarted(): boolean {
    return this.dates != null && this.today > this.dates.date_result_begin;
  }

  isVoteRunning(): boolean {
    return (
      this.dates != null &&
      this.today > this.dates.date_begin &&
      this.today < this.dates.date_end
    );
  }

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
      if (
        dateBegin != null &&
        dateEnd != null &&
        dateResultBegin != null &&
        dateResultEnd != null
      ) {
        this.dates = {
          date_begin: dateBegin,
          date_end: dateEnd,
          date_result_begin: dateResultBegin,
          date_result_end: dateResultEnd,
        };
      } else this.dates = null;
    } else this.dates = null;
  }

  /**
   * Renders the authenticated screen.
   *
   * Teams and dates are not mandatory to allow showing the information box even if api requests fail
   *
   * @returns {*}
   */
  render(): React.Node {
    const {props, state} = this;
    return (
      <View style={{flex: 1}}>
        <AuthenticatedScreen
          navigation={props.navigation}
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
          visible={state.mascotDialogVisible}
          title={i18n.t('screens.vote.mascotDialog.title')}
          message={i18n.t('screens.vote.mascotDialog.message')}
          icon="vote"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.vote.mascotDialog.button'),
              icon: 'check',
              onPress: this.hideMascotDialog,
            },
          }}
          emotion={MASCOT_STYLE.CUTE}
        />
      </View>
    );
  }
}
