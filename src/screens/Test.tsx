import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Animated, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  Collapsible,
  useCollapsibleHeader,
} from 'react-navigation-collapsible';
import CollapsibleFlatList from '../components/Collapsible/CollapsibleFlatList';
import FeedItem from '../components/Home/FeedItem';
import WebSectionList from '../components/Screens/WebSectionList';
import withCollapsible from '../utils/withCollapsible';
import { FeedItemType } from './Home/HomeScreen';
import i18n from 'i18n-js';
import CollapsibleSectionList from '../components/Collapsible/CollapsibleSectionList';

// export default function Test() {
//   const {
//     onScroll /* Event handler */,
//     onScrollWithListener /* Event handler creator */,
//     containerPaddingTop /* number */,
//     scrollIndicatorInsetTop /* number */,
//     /* Animated.AnimatedValue contentOffset from scrolling */
//     positionY /* 0.0 ~ length of scrollable component (contentOffset)
//     /* Animated.AnimatedInterpolation by scrolling */,
//     translateY /* 0.0 ~ -headerHeight */,
//     progress /* 0.0 ~ 1.0 */,
//     opacity /* 1.0 ~ 0.0 */,
//   } = useCollapsibleHeader();

//   const renderItem = () => {
//     return (
//       <View
//         style={{
//           marginTop: 50,
//           marginBottom: 50,
//         }}
//       >
//         <Text>TEST</Text>
//       </View>
//     );
//   };

//   return (
//     <Animated.FlatList
//       onScroll={onScroll}
//       contentContainerStyle={{ paddingTop: containerPaddingTop }}
//       scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
//       data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
//       renderItem={renderItem}
//     />
//   );
// }

type Props = {
  navigation: StackNavigationProp<any>;
  collapsibleStack: Collapsible;
};

const DATA_URL =
  'https://etud.insa-toulouse.fr/~amicale_app/v2/dashboard/dashboard_data.json';
const FEED_ITEM_HEIGHT = 500;

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds
class Test extends React.Component<Props> {
  createDataset = (): Array<{
    title: string;
    data: [] | Array<FeedItemType>;
    id: string;
  }> => {
    return [
      {
        title: 'title',
        data: [
          {
            id: '0',
            message: 'message',
            image: '',
            link: '',
            page_id: 'amicale.deseleves',
            time: 0,
            url: '',
            video: '',
          },
          {
            id: '1',
            message: 'message',
            image: '',
            link: '',
            page_id: 'amicale.deseleves',
            time: 0,
            url: '',
            video: '',
          },
          {
            id: '2',
            message: 'message',
            image: '',
            link: '',
            page_id: 'amicale.deseleves',
            time: 0,
            url: '',
            video: '',
          },
        ],
        id: '0',
      },
    ];
  };
  getRenderItem = ({ item }: { item: FeedItemType }) => (
    <FeedItem item={item} height={FEED_ITEM_HEIGHT} />
  );

  render() {
    const renderItem = () => {
      return (
        <View
          style={{
            marginTop: 50,
            marginBottom: 50,
          }}
        >
          <Text>TEST</Text>
        </View>
      );
    };

    const props = this.props;
    // return (
    //   <CollapsibleFlatList
    //     data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    //     renderItem={renderItem}
    //   />
    // );
    // return (
    //   <CollapsibleSectionList
    //     sections={[{ title: '', data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
    //     renderItem={renderItem}
    //   />
    // );
    return (
      <WebSectionList
        createDataset={this.createDataset}
        autoRefreshTime={REFRESH_TIME}
        refreshOnFocus
        fetchUrl={DATA_URL}
        renderItem={this.getRenderItem}
        itemHeight={FEED_ITEM_HEIGHT}
        showError={false}
      />
    );
  }
}

export default Test;
