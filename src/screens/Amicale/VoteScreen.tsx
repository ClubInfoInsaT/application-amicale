/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { Button } from 'react-native-paper';
import { getTimeOnlyString, stringToDate } from '../../utils/Planning';
import VoteTease from '../../components/Amicale/Vote/VoteTease';
import VoteSelect from '../../components/Amicale/Vote/VoteSelect';
import VoteResults from '../../components/Amicale/Vote/VoteResults';
import VoteWait from '../../components/Amicale/Vote/VoteWait';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import VoteNotAvailable from '../../components/Amicale/Vote/VoteNotAvailable';
import GENERAL_STYLES from '../../constants/Styles';
import ConnectionManager from '../../managers/ConnectionManager';
import WebSectionList, {
  SectionListDataType,
} from '../../components/Screens/WebSectionList';

export type VoteTeamType = {
  id: number;
  name: string;
  votes: number;
};

type TeamResponseType = {
  has_voted: boolean;
  teams: Array<VoteTeamType>;
};

type VoteDatesStringType = {
  date_begin: string;
  date_end: string;
  date_result_begin: string;
  date_result_end: string;
};

type VoteDatesObjectType = {
  date_begin: Date;
  date_end: Date;
  date_result_begin: Date;
  date_result_end: Date;
};

type ResponseType = {
  teams?: TeamResponseType;
  dates?: VoteDatesStringType;
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

type PropsType = {};

type StateType = {
  hasVoted: boolean;
  mascotDialogVisible: boolean;
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
});

/**
 * Screen displaying vote information and controls
 */
export default class VoteScreen extends React.Component<PropsType, StateType> {
  teams: Array<VoteTeamType>;

  hasVoted: boolean;

  datesString: undefined | VoteDatesStringType;

  dates: undefined | VoteDatesObjectType;

  today: Date;

  mainFlatListData: SectionListDataType<{ key: string }>;

  refreshData: () => void;

  constructor(props: PropsType) {
    super(props);
    this.teams = [];
    this.datesString = undefined;
    this.dates = undefined;
    this.state = {
      hasVoted: false,
      mascotDialogVisible: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.voteShowMascot.key
      ),
    };
    this.hasVoted = false;
    this.today = new Date();
    this.refreshData = () => undefined;
    this.mainFlatListData = [
      { title: '', data: [{ key: 'main' }, { key: 'info' }] },
    ];
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

  getMainRenderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === 'info') {
      return (
        <View>
          <Button
            mode="contained"
            icon="help-circle"
            onPress={this.showMascotDialog}
            style={styles.button}
          >
            {i18n.t('screens.vote.mascotDialog.title')}
          </Button>
        </View>
      );
    }
    return this.getContent();
  };

  createDataset = (
    data: ResponseType | undefined,
    _loading: boolean,
    _lastRefreshDate: Date | undefined,
    refreshData: () => void
  ) => {
    // data[0] = FAKE_TEAMS2;
    // data[1] = FAKE_DATE;
    this.refreshData = refreshData;
    if (data) {
      const { teams, dates } = data;

      if (dates && dates.date_begin == null) {
        this.datesString = undefined;
      } else {
        this.datesString = dates;
      }

      if (teams) {
        this.teams = teams.teams;
        this.hasVoted = teams.has_voted;
      }

      this.generateDateObject();
    }
    return this.mainFlatListData;
  };

  getContent() {
    const { state } = this;
    if (!this.isVoteStarted()) {
      return this.getTeaseVoteCard();
    }
    if (this.isVoteRunning() && !this.hasVoted && !state.hasVoted) {
      return this.getVoteCard();
    }
    if (!this.isResultStarted()) {
      return this.getWaitVoteCard();
    }
    if (this.isResultRunning()) {
      return this.getVoteResultCard();
    }
    return <VoteNotAvailable />;
  }

  onVoteSuccess = (): void => this.setState({ hasVoted: true });

  /**
   * The user has not voted yet, and the votes are open
   */
  getVoteCard() {
    return (
      <VoteSelect
        teams={this.teams}
        onVoteSuccess={this.onVoteSuccess}
        onVoteError={this.refreshData}
      />
    );
  }

  /**
   * Votes have ended, results can be displayed
   */
  getVoteResultCard() {
    if (this.dates != null && this.datesString != null) {
      return (
        <VoteResults
          teams={this.teams}
          dateEnd={this.getDateString(
            this.dates.date_result_end,
            this.datesString.date_result_end
          )}
        />
      );
    }
    return <VoteNotAvailable />;
  }

  /**
   * Vote will open shortly
   */
  getTeaseVoteCard() {
    if (this.dates != null && this.datesString != null) {
      return (
        <VoteTease
          startDate={this.getDateString(
            this.dates.date_begin,
            this.datesString.date_begin
          )}
        />
      );
    }
    return <VoteNotAvailable />;
  }

  /**
   * Votes have ended, or user has voted waiting for results
   */
  getWaitVoteCard() {
    const { state } = this;
    let startDate = null;
    if (
      this.dates != null &&
      this.datesString != null &&
      this.dates.date_result_begin != null
    ) {
      startDate = this.getDateString(
        this.dates.date_result_begin,
        this.datesString.date_result_begin
      );
    }
    return (
      <VoteWait
        startDate={startDate}
        hasVoted={this.hasVoted || state.hasVoted}
        justVoted={state.hasVoted}
        isVoteRunning={this.isVoteRunning()}
      />
    );
  }

  showMascotDialog = () => {
    this.setState({ mascotDialogVisible: true });
  };

  hideMascotDialog = () => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.voteShowMascot.key,
      false
    );
    this.setState({ mascotDialogVisible: false });
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
      } else {
        this.dates = undefined;
      }
    } else {
      this.dates = undefined;
    }
  }

  request = () => {
    return new Promise((resolve: (data: ResponseType) => void) => {
      ConnectionManager.getInstance()
        .authenticatedRequest<VoteDatesStringType>('elections/dates')
        .then((datesData) => {
          ConnectionManager.getInstance()
            .authenticatedRequest<TeamResponseType>('elections/teams')
            .then((teamsData) => {
              resolve({
                dates: datesData,
                teams: teamsData,
              });
            })
            .catch(() =>
              resolve({
                dates: datesData,
              })
            );
        })
        .catch(() => resolve({}));
    });
  };

  /**
   * Renders the authenticated screen.
   *
   * Teams and dates are not mandatory to allow showing the information box even if api requests fail
   *
   * @returns {*}
   */
  render() {
    const { state } = this;
    return (
      <View style={GENERAL_STYLES.flex}>
        <WebSectionList
          request={this.request}
          createDataset={this.createDataset}
          extraData={state.hasVoted.toString()}
          renderItem={this.getMainRenderItem}
        />
        <MascotPopup
          visible={state.mascotDialogVisible}
          title={i18n.t('screens.vote.mascotDialog.title')}
          message={i18n.t('screens.vote.mascotDialog.message')}
          icon="vote"
          buttons={{
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
