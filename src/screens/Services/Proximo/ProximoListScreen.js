// @flow

import * as React from 'react';
import {Image, Platform, ScrollView, View} from 'react-native';
import i18n from 'i18n-js';
import {
  RadioButton,
  Searchbar,
  Subheading,
  Text,
  Title,
  withTheme,
} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Modalize} from 'react-native-modalize';
import CustomModal from '../../../components/Overrides/CustomModal';
import {stringMatchQuery} from '../../../utils/Search';
import ProximoListItem from '../../../components/Lists/Proximo/ProximoListItem';
import MaterialHeaderButtons, {
  Item,
} from '../../../components/Overrides/CustomHeaderButton';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';
import type {ProximoArticleType} from './ProximoMainScreen';

function sortPrice(a: ProximoArticleType, b: ProximoArticleType): number {
  return parseInt(a.price, 10) - parseInt(b.price, 10);
}

function sortPriceReverse(
  a: ProximoArticleType,
  b: ProximoArticleType,
): number {
  return parseInt(b.price, 10) - parseInt(a.price, 10);
}

function sortName(a: ProximoArticleType, b: ProximoArticleType): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
}

function sortNameReverse(a: ProximoArticleType, b: ProximoArticleType): number {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
  return 0;
}

const LIST_ITEM_HEIGHT = 84;

type PropsType = {
  navigation: StackNavigationProp,
  route: {
    params: {
      data: {data: Array<ProximoArticleType>},
      shouldFocusSearchBar: boolean,
    },
  },
  theme: CustomThemeType,
};

type StateType = {
  currentSortMode: number,
  modalCurrentDisplayItem: React.Node,
  currentSearchString: string,
};

/**
 * Class defining Proximo article list of a certain category.
 */
class ProximoListScreen extends React.Component<PropsType, StateType> {
  modalRef: Modalize | null;

  listData: Array<ProximoArticleType>;

  shouldFocusSearchBar: boolean;

  constructor(props: PropsType) {
    super(props);
    this.listData = props.route.params.data.data.sort(sortName);
    this.shouldFocusSearchBar = props.route.params.shouldFocusSearchBar;
    this.state = {
      currentSearchString: '',
      currentSortMode: 3,
      modalCurrentDisplayItem: null,
    };
  }

  /**
   * Creates the header content
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: this.getSortMenuButton,
      headerTitle: this.getSearchBar,
      headerBackTitleVisible: false,
      headerTitleContainerStyle:
        Platform.OS === 'ios'
          ? {marginHorizontal: 0, width: '70%'}
          : {marginHorizontal: 0, right: 50, left: 50},
    });
  }

  /**
   * Callback used when clicking on the sort menu button.
   * It will open the modal to show a sort selection
   */
  onSortMenuPress = () => {
    this.setState({
      modalCurrentDisplayItem: this.getModalSortMenu(),
    });
    if (this.modalRef) {
      this.modalRef.open();
    }
  };

  /**
   * Callback used when the search changes
   *
   * @param str The new search string
   */
  onSearchStringChange = (str: string) => {
    this.setState({currentSearchString: str});
  };

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param item The article pressed
   */
  onListItemPress(item: ProximoArticleType) {
    this.setState({
      modalCurrentDisplayItem: this.getModalItemContent(item),
    });
    if (this.modalRef) {
      this.modalRef.open();
    }
  }

  /**
   * Sets the current sort mode.
   *
   * @param mode The number representing the mode
   */
  setSortMode(mode: string) {
    const {currentSortMode} = this.state;
    const currentMode = parseInt(mode, 10);
    this.setState({
      currentSortMode: currentMode,
    });
    switch (currentMode) {
      case 1:
        this.listData.sort(sortPrice);
        break;
      case 2:
        this.listData.sort(sortPriceReverse);
        break;
      case 3:
        this.listData.sort(sortName);
        break;
      case 4:
        this.listData.sort(sortNameReverse);
        break;
      default:
        this.listData.sort(sortName);
        break;
    }
    if (this.modalRef && currentMode !== currentSortMode) this.modalRef.close();
  }

  /**
   * Gets a color depending on the quantity available
   *
   * @param availableStock The quantity available
   * @return
   */
  getStockColor(availableStock: number): string {
    const {theme} = this.props;
    let color: string;
    if (availableStock > 3) color = theme.colors.success;
    else if (availableStock > 0) color = theme.colors.warning;
    else color = theme.colors.danger;
    return color;
  }

  /**
   * Gets the sort menu header button
   *
   * @return {*}
   */
  getSortMenuButton = (): React.Node => {
    return (
      <MaterialHeaderButtons>
        <Item title="main" iconName="sort" onPress={this.onSortMenuPress} />
      </MaterialHeaderButtons>
    );
  };

  /**
   * Gets the header search bar
   *
   * @return {*}
   */
  getSearchBar = (): React.Node => {
    return (
      <Searchbar
        placeholder={i18n.t('screens.proximo.search')}
        onChangeText={this.onSearchStringChange}
      />
    );
  };

  /**
   * Gets the modal content depending on the given article
   *
   * @param item The article to display
   * @return {*}
   */
  getModalItemContent(item: ProximoArticleType): React.Node {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <Title>{item.name}</Title>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 10,
          }}>
          <Subheading
            style={{
              color: this.getStockColor(parseInt(item.quantity, 10)),
            }}>
            {`${item.quantity} ${i18n.t('screens.proximo.inStock')}`}
          </Subheading>
          <Subheading style={{marginLeft: 'auto'}}>{item.price}€</Subheading>
        </View>

        <ScrollView>
          <View
            style={{
              width: '100%',
              height: 150,
              marginTop: 20,
              marginBottom: 20,
            }}>
            <Image
              style={{flex: 1, resizeMode: 'contain'}}
              source={{uri: item.image}}
            />
          </View>
          <Text>{item.description}</Text>
        </ScrollView>
      </View>
    );
  }

  /**
   * Gets the modal content to display a sort menu
   *
   * @return {*}
   */
  getModalSortMenu(): React.Node {
    const {currentSortMode} = this.state;
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <Title style={{marginBottom: 10}}>
          {i18n.t('screens.proximo.sortOrder')}
        </Title>
        <RadioButton.Group
          onValueChange={(value: string) => {
            this.setSortMode(value);
          }}
          value={currentSortMode}>
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPrice')}
            value={1}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortPriceReverse')}
            value={2}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortName')}
            value={3}
          />
          <RadioButton.Item
            label={i18n.t('screens.proximo.sortNameReverse')}
            value={4}
          />
        </RadioButton.Group>
      </View>
    );
  }

  /**
   * Gets a render item for the given article
   *
   * @param item The article to render
   * @return {*}
   */
  getRenderItem = ({item}: {item: ProximoArticleType}): React.Node => {
    const {currentSearchString} = this.state;
    if (stringMatchQuery(item.name, currentSearchString)) {
      const onPress = () => {
        this.onListItemPress(item);
      };
      const color = this.getStockColor(parseInt(item.quantity, 10));
      return (
        <ProximoListItem
          item={item}
          onPress={onPress}
          color={color}
          height={LIST_ITEM_HEIGHT}
        />
      );
    }
    return null;
  };

  /**
   * Extracts a key for the given article
   *
   * @param item The article to extract the key from
   * @return {string} The extracted key
   */
  keyExtractor = (item: ProximoArticleType): string => item.name + item.code;

  /**
   * Callback used when receiving the modal ref
   *
   * @param ref
   */
  onModalRef = (ref: Modalize) => {
    this.modalRef = ref;
  };

  itemLayout = (
    data: ProximoArticleType,
    index: number,
  ): {length: number, offset: number, index: number} => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  render(): React.Node {
    const {state} = this;
    return (
      <View
        style={{
          height: '100%',
        }}>
        <CustomModal onRef={this.onModalRef}>
          {state.modalCurrentDisplayItem}
        </CustomModal>
        <CollapsibleFlatList
          data={this.listData}
          extraData={state.currentSearchString + state.currentSortMode}
          keyExtractor={this.keyExtractor}
          renderItem={this.getRenderItem}
          // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
          removeClippedSubviews
          getItemLayout={this.itemLayout}
          initialNumToRender={10}
        />
      </View>
    );
  }
}

export default withTheme(ProximoListScreen);
