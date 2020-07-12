// @flow

import * as React from 'react';
import {Card, Chip, List, Text} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import i18n from 'i18n-js';
import AnimatedAccordion from "../../Animations/AnimatedAccordion";
import {isItemInCategoryFilter} from "../../../utils/Search";
import type {category} from "../../../screens/Amicale/Clubs/ClubListScreen";

type Props = {
    categories: Array<category>,
    onChipSelect: (id: number) => void,
    selectedCategories: Array<number>,
}

class ClubListHeader extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props) {
        return nextProps.selectedCategories.length !== this.props.selectedCategories.length;
    }

    getChipRender = (category: category, key: string) => {
        const onPress = () => this.props.onChipSelect(category.id);
        return <Chip
            selected={isItemInCategoryFilter(this.props.selectedCategories, [category.id])}
            mode={'outlined'}
            onPress={onPress}
            style={{marginRight: 5, marginLeft: 5, marginBottom: 5}}
            key={key}
        >
            {category.name}
        </Chip>;
    };


    getCategoriesRender() {
        let final = [];
        for (let i = 0; i < this.props.categories.length; i++) {
            final.push(this.getChipRender(this.props.categories[i], this.props.categories[i].id.toString()));
        }
        return final;
    }

    render() {
        return (
            <Card style={styles.card}>
                <AnimatedAccordion
                    title={i18n.t("screens.clubs.categories")}
                    left={props => <List.Icon {...props} icon="star"/>}
                    opened={true}
                >
                    <Text style={styles.text}>{i18n.t("screens.clubs.categoriesFilterMessage")}</Text>
                    <View style={styles.chipContainer}>
                        {this.getCategoriesRender()}
                    </View>
                </AnimatedAccordion>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 5
    },
    text: {
        paddingLeft: 0,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    chipContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 0,
        marginBottom: 5,
    },
});

export default ClubListHeader;
