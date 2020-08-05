// @flow

import * as React from 'react';
import {BackHandler, View} from 'react-native';
import i18n from 'i18n-js';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Avatar, Divider, List} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {readData} from '../../utils/WebData';
import type {PlanningEventType} from '../../utils/Planning';
import {
  generateEventAgenda,
  getCurrentDateString,
  getDateOnlyString,
  getFormattedEventTime,
} from '../../utils/Planning';
import CustomAgenda from '../../components/Overrides/CustomAgenda';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../managers/AsyncStorageManager';

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui",
};

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  refreshing: boolean,
  agendaItems: {[key: string]: Array<PlanningEventType>},
  calendarShowing: boolean,
};

const FETCH_URL = 'https://www.amicale-insat.fr/api/event/list';
const AGENDA_MONTH_SPAN = 3;

/**
 * Class defining the app's planning screen
 */
class PlanningScreen extends React.Component<PropsType, StateType> {
  agendaRef: null | Agenda;

  lastRefresh: Date;

  minTimeBetweenRefresh = 60;

  currentDate = getDateOnlyString(getCurrentDateString());

  constructor(props: PropsType) {
    super(props);
    if (i18n.currentLocale().startsWith('fr')) {
      LocaleConfig.defaultLocale = 'fr';
    }
    this.state = {
      refreshing: false,
      agendaItems: {},
      calendarShowing: false,
    };
  }

  /**
   * Captures focus and blur events to hook on android back button
   */
  componentDidMount() {
    const {navigation} = this.props;
    this.onRefresh();
    navigation.addListener('focus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
    navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
  }

  /**
   * Overrides default android back button behaviour to close the calendar if it was open.
   *
   * @return {boolean}
   */
  onBackButtonPressAndroid = (): boolean => {
    const {calendarShowing} = this.state;
    if (calendarShowing && this.agendaRef != null) {
      this.agendaRef.chooseDay(this.agendaRef.state.selectedDay);
      return true;
    }
    return false;
  };

  /**
   * Refreshes data and shows an animation while doing it
   */
  onRefresh = () => {
    let canRefresh;
    if (this.lastRefresh !== undefined)
      canRefresh =
        (new Date().getTime() - this.lastRefresh.getTime()) / 1000 >
        this.minTimeBetweenRefresh;
    else canRefresh = true;

    if (canRefresh) {
      this.setState({refreshing: true});
      readData(FETCH_URL)
        .then((fetchedData: Array<PlanningEventType>) => {
          this.setState({
            refreshing: false,
            agendaItems: generateEventAgenda(fetchedData, AGENDA_MONTH_SPAN),
          });
          this.lastRefresh = new Date();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  };

  /**
   * Callback used when receiving the agenda ref
   *
   * @param ref
   */
  onAgendaRef = (ref: Agenda) => {
    this.agendaRef = ref;
  };

  /**
   * Callback used when a button is pressed to toggle the calendar
   *
   * @param isCalendarOpened True is the calendar is already open, false otherwise
   */
  onCalendarToggled = (isCalendarOpened: boolean) => {
    this.setState({calendarShowing: isCalendarOpened});
  };

  /**
   * Gets an event render item
   *
   * @param item The current event to render
   * @return {*}
   */
  getRenderItem = (item: PlanningEventType): React.Node => {
    const {navigation} = this.props;
    const onPress = () => {
      navigation.navigate('planning-information', {
        data: item,
      });
    };
    if (item.logo !== null) {
      return (
        <View>
          <Divider />
          <List.Item
            title={item.title}
            description={getFormattedEventTime(item.date_begin, item.date_end)}
            left={(): React.Node => (
              <Avatar.Image
                source={{uri: item.logo}}
                style={{backgroundColor: 'transparent'}}
              />
            )}
            onPress={onPress}
          />
        </View>
      );
    }
    return (
      <View>
        <Divider />
        <List.Item
          title={item.title}
          description={getFormattedEventTime(item.date_begin, item.date_end)}
          onPress={onPress}
        />
      </View>
    );
  };

  /**
   * Gets an empty render item for an empty date
   *
   * @return {*}
   */
  getRenderEmptyDate = (): React.Node => <Divider />;

  render(): React.Node {
    const {state, props} = this;
    return (
      <View style={{flex: 1}}>
        <CustomAgenda
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          // the list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={state.agendaItems}
          // initially selected day
          selected={this.currentDate}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={this.currentDate}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={1}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={AGENDA_MONTH_SPAN}
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
          onRefresh={this.onRefresh}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={this.onCalendarToggled}
          // Set this true while waiting for new data from a refresh
          refreshing={state.refreshing}
          renderItem={this.getRenderItem}
          renderEmptyDate={this.getRenderEmptyDate}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // ref to this agenda in order to handle back button event
          onRef={this.onAgendaRef}
        />
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.eventsShowBanner.key}
          title={i18n.t('screens.planning.mascotDialog.title')}
          message={i18n.t('screens.planning.mascotDialog.message')}
          icon="party-popper"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.planning.mascotDialog.button'),
              icon: 'check',
            },
          }}
          emotion={MASCOT_STYLE.HAPPY}
        />
      </View>
    );
  }
}

export default PlanningScreen;
