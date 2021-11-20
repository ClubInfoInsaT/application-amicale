import React from 'react';
import { List } from 'react-native-paper';

export type ListItemType = {
  onPressCallback: () => void;
  icon: string;
  text: string;
  showChevron: boolean;
};

type Props = {
  item: ListItemType;
};

const getItemIcon = (
  item: ListItemType,
  props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }
) => {
  return <List.Icon color={props.color} style={props.style} icon={item.icon} />;
};

const getChevronIcon = (props: {
  color: string;
  style?: {
    marginRight: number;
    marginVertical?: number;
  };
}) => {
  return (
    <List.Icon color={props.color} style={props.style} icon="chevron-right" />
  );
};

export default function AboutCardItem(props: Props) {
  const { item } = props;
  if (item.showChevron) {
    return (
      <List.Item
        title={item.text}
        left={(p) => getItemIcon(item, p)}
        right={getChevronIcon}
        onPress={item.onPressCallback}
      />
    );
  }
  return (
    <List.Item
      title={item.text}
      left={(p) => getItemIcon(item, p)}
      onPress={item.onPressCallback}
    />
  );
}
