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

import React, { useRef, useState } from 'react';
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
import VoteNotAvailable from '../../components/Amicale/Vote/VoteNotAvailable';
import GENERAL_STYLES from '../../constants/Styles';
import WebSectionList, {
  SectionListDataType,
} from '../../components/Screens/WebSectionList';
import { useAuthenticatedRequest } from '../../context/loginContext';

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

type FlatlistType = {
  teams: Array<VoteTeamType>;
  hasVoted: boolean;
  datesString?: VoteDatesStringType;
  dates?: VoteDatesObjectType;
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
export default function VoteScreen() {
  const [hasVoted, setHasVoted] = useState(false);
  const [mascotDialogVisible, setMascotDialogVisible] = useState(false);

  const datesRequest = useAuthenticatedRequest<VoteDatesStringType>(
    'elections/dates'
  );
  const teamsRequest = useAuthenticatedRequest<TeamResponseType>(
    'elections/teams'
  );

  const today = new Date();
  const refresh = useRef<() => void | undefined>();
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
  const getDateString = (date: Date, dateString: string) => {
    if (today.getDate() === date.getDate()) {
      const str = getTimeOnlyString(dateString);
      return str != null ? str : '';
    }
    return dateString;
  };

  const getMainRenderItem = ({
    item,
  }: {
    item: { key: string; data?: FlatlistType };
  }) => {
    if (item.key === 'info') {
      return (
        <View>
          <Button
            mode="contained"
            icon="help-circle"
            onPress={showMascotDialog}
            style={styles.button}
          >
            {i18n.t('screens.vote.mascotDialog.title')}
          </Button>
        </View>
      );
    }
    if (item.data) {
      return getContent(item.data);
    } else {
      return <View />;
    }
  };

  const createDataset = (
    data: ResponseType | undefined,
    _loading: boolean,
    _lastRefreshDate: Date | undefined,
    refreshData: () => void
  ) => {
    // data[0] = FAKE_TEAMS2;
    // data[1] = FAKE_DATE;

    const mainFlatListData: SectionListDataType<{
      key: string;
      data?: FlatlistType;
    }> = [
      {
        title: '',
        data: [{ key: 'main' }, { key: 'info' }],
      },
    ];
    refresh.current = refreshData;
    if (data) {
      const { teams, dates } = data;
      const flatlistData: FlatlistType = {
        teams: [],
        hasVoted: false,
      };
      if (dates && dates.date_begin != null) {
        flatlistData.datesString = dates;
      }
      if (teams) {
        flatlistData.teams = teams.teams;
        flatlistData.hasVoted = teams.has_voted;
      }
      flatlistData.dates = generateDateObject(flatlistData.datesString);
    }
    return mainFlatListData;
  };

  const getContent = (data: FlatlistType) => {
    const { dates } = data;
    if (!isVoteStarted(dates)) {
      return getTeaseVoteCard(data);
    }
    if (isVoteRunning(dates) && !data.hasVoted && !hasVoted) {
      return getVoteCard(data);
    }
    if (!isResultStarted(dates)) {
      return getWaitVoteCard(data);
    }
    if (isResultRunning(dates)) {
      return getVoteResultCard(data);
    }
    return <VoteNotAvailable />;
  };

  const onVoteSuccess = () => setHasVoted(true);
  /**
   * The user has not voted yet, and the votes are open
   */
  const getVoteCard = (data: FlatlistType) => {
    return (
      <VoteSelect
        teams={data.teams}
        onVoteSuccess={onVoteSuccess}
        onVoteError={() => {
          if (refresh.current) {
            refresh.current();
          }
        }}
      />
    );
  };
  /**
   * Votes have ended, results can be displayed
   */
  const getVoteResultCard = (data: FlatlistType) => {
    if (data.dates != null && data.datesString != null) {
      return (
        <VoteResults
          teams={data.teams}
          dateEnd={getDateString(
            data.dates.date_result_end,
            data.datesString.date_result_end
          )}
        />
      );
    }
    return <VoteNotAvailable />;
  };
  /**
   * Vote will open shortly
   */
  const getTeaseVoteCard = (data: FlatlistType) => {
    if (data.dates != null && data.datesString != null) {
      return (
        <VoteTease
          startDate={getDateString(
            data.dates.date_begin,
            data.datesString.date_begin
          )}
        />
      );
    }
    return <VoteNotAvailable />;
  };
  /**
   * Votes have ended, or user has voted waiting for results
   */
  const getWaitVoteCard = (data: FlatlistType) => {
    let startDate = null;
    if (
      data.dates != null &&
      data.datesString != null &&
      data.dates.date_result_begin != null
    ) {
      startDate = getDateString(
        data.dates.date_result_begin,
        data.datesString.date_result_begin
      );
    }
    return (
      <VoteWait
        startDate={startDate}
        hasVoted={data.hasVoted}
        justVoted={hasVoted}
        isVoteRunning={isVoteRunning()}
      />
    );
  };

  const showMascotDialog = () => setMascotDialogVisible(true);

  const hideMascotDialog = () => setMascotDialogVisible(false);

  const isVoteStarted = (dates?: VoteDatesObjectType) => {
    return dates != null && today > dates.date_begin;
  };

  const isResultRunning = (dates?: VoteDatesObjectType) => {
    return (
      dates != null &&
      today > dates.date_result_begin &&
      today < dates.date_result_end
    );
  };

  const isResultStarted = (dates?: VoteDatesObjectType) => {
    return dates != null && today > dates.date_result_begin;
  };

  const isVoteRunning = (dates?: VoteDatesObjectType) => {
    return dates != null && today > dates.date_begin && today < dates.date_end;
  };

  /**
   * Generates the objects containing string and Date representations of key vote dates
   */
  const generateDateObject = (
    strings?: VoteDatesStringType
  ): VoteDatesObjectType | undefined => {
    if (strings) {
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
        return {
          date_begin: dateBegin,
          date_end: dateEnd,
          date_result_begin: dateResultBegin,
          date_result_end: dateResultEnd,
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  const request = () => {
    return new Promise((resolve: (data: ResponseType) => void) => {
      datesRequest()
        .then((datesData) => {
          teamsRequest()
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

  return (
    <View style={GENERAL_STYLES.flex}>
      <WebSectionList
        request={request}
        createDataset={createDataset}
        extraData={hasVoted.toString()}
        renderItem={getMainRenderItem}
      />
      <MascotPopup
        visible={mascotDialogVisible}
        title={i18n.t('screens.vote.mascotDialog.title')}
        message={i18n.t('screens.vote.mascotDialog.message')}
        icon="vote"
        buttons={{
          cancel: {
            message: i18n.t('screens.vote.mascotDialog.button'),
            icon: 'check',
            onPress: hideMascotDialog,
          },
        }}
        emotion={MASCOT_STYLE.CUTE}
      />
    </View>
  );
}
