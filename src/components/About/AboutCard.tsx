import React from 'react';
import { FlatList, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import AboutCardItem, { ListItemType } from './AboutCardItem';

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
  image?: ImageSourcePropType;
  data: Array<ListItemType>;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
});

export default function AboutCard(props: Props) {
  const { icon, image } = props;
  let left: undefined | ((iconProps: { size: number }) => React.ReactElement);
  if (icon != null) {
    left = (iconProps) => <Avatar.Icon size={iconProps.size} icon={icon} />;
  } else if (image != null) {
    left = (iconProps) => (
      <Image
        source={image}
        style={{ width: iconProps.size, height: iconProps.size }}
      />
    );
  }

  const keyExtractor = (item: ListItemType, index: number): string =>
    item.icon + index;

  const renderItem = ({ item }: { item: ListItemType }) => (
    <AboutCardItem item={item} />
  );

  return (
    <Card style={styles.card}>
      <Card.Title title={props.title} subtitle={props.subtitle} left={left} />
      <Card.Content>
        <FlatList
          data={props.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Card.Content>
    </Card>
  );
}
