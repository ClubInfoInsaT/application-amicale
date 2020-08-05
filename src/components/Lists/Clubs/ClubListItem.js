// @flow

import * as React from 'react';
import {Avatar, Chip, List, withTheme} from 'react-native-paper';
import {View} from 'react-native';
import type {
  ClubCategoryType,
  ClubType,
} from '../../../screens/Amicale/Clubs/ClubListScreen';
import type {CustomThemeType} from '../../../managers/ThemeManager';

type PropsType = {
  onPress: () => void,
  categoryTranslator: (id: number) => ClubCategoryType,
  item: ClubType,
  height: number,
  theme: CustomThemeType,
};

class ClubListItem extends React.Component<PropsType> {
  hasManagers: boolean;

  constructor(props: PropsType) {
    super(props);
    this.hasManagers = props.item.responsibles.length > 0;
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  getCategoriesRender(categories: Array<number | null>): React.Node {
    const {props} = this;
    const final = [];
    categories.forEach((cat: number | null) => {
      if (cat != null) {
        const category: ClubCategoryType = props.categoryTranslator(cat);
        final.push(
          <Chip
            style={{marginRight: 5, marginBottom: 5}}
            key={`${props.item.id}:${category.id}`}>
            {category.name}
          </Chip>,
        );
      }
    });
    return <View style={{flexDirection: 'row'}}>{final}</View>;
  }

  render(): React.Node {
    const {props} = this;
    const categoriesRender = (): React.Node =>
      this.getCategoriesRender(props.item.category);
    const {colors} = props.theme;
    return (
      <List.Item
        title={props.item.name}
        description={categoriesRender}
        onPress={props.onPress}
        left={(): React.Node => (
          <Avatar.Image
            style={{
              backgroundColor: 'transparent',
              marginLeft: 10,
              marginRight: 10,
            }}
            size={64}
            source={{uri: props.item.logo}}
          />
        )}
        right={(): React.Node => (
          <Avatar.Icon
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              backgroundColor: 'transparent',
            }}
            size={48}
            icon={
              this.hasManagers ? 'check-circle-outline' : 'alert-circle-outline'
            }
            color={this.hasManagers ? colors.success : colors.primary}
          />
        )}
        style={{
          height: props.height,
          justifyContent: 'center',
        }}
      />
    );
  }
}

export default withTheme(ClubListItem);
