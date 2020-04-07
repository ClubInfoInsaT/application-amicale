// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import {Avatar, Card, Chip, Paragraph, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import i18n from "i18n-js";
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";

type Props = {
    navigation: Object,
    route: Object
};

type State = {
    imageModalVisible: boolean,
};

function openWebLink(event, link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

const FakeClub = {
    "category": [
        3,
        6,
    ],
    "description": "<p class=\"ql-align-justify\">Les 100 Tours de l’INSA reviennent en force pour une cinquième édition les 5 et 6 juin prochain&nbsp;!</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Prépare-toi pour le plus gros évènement de l’année sur le campus de notre belle école qui nous réunit tous autour d’activités folles&nbsp;pour fêter la fin de l’année dans la bonne humeur !</p><p class=\"ql-align-justify\">L’éco-festival tournera autour d’une grande course par équipe qui nous vaut ce doux nom de 100 tours. Ce sera le moment de défier tes potes pour tenter de remporter de nombreux lots, et surtout l’admiration de tous. Mais cela ne s’arrête pas là, puisque tu pourras aussi participer à des activités à sensation, divers ateliers, et de quoi chiller avec tes potes en écoutant de la bonne musique. Tu pourras ensuite enchaîner sur LA soirée de l’année, rythmée par des artistes sur-motivés&nbsp;!</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Tu es bien entendu le bienvenu si l’envie te prend de rejoindre l’équipe et de nous aider à organiser cet évènement du turfu&nbsp;!</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">La team 100 Tours</p><p class=\"ql-align-justify\"><br></p><p>Contact&nbsp;: <a href=\"mailto:100Tours@amicale-insat.fr\" target=\"_blank\">100tours@amicale-insat.fr</a></p><p>Facebook&nbsp;: Les 100 Tours de l’INSA</p><p>Instagram&nbsp;: 100tours.insatoulouse</p>",
    "id": 110,
    "logo": "https://www.amicale-insat.fr/storage/clubLogos/2cca8885dd3bdf902124f038b548962b.jpeg",
    "name": "100 Tours",
    "responsibles": [
        "Juliette Duval",
        "Emilie Cuminal",
        "Maxime Doré",
    ],
};

/**
 * Class defining a planning event information page.
 * If called with data and categories navigation parameters, will use those to display the data.
 * If called with clubId parameter, will fetch the information on the server
 */
class ClubDisplayScreen extends React.Component<Props, State> {

    displayData: Object;
    categories: Object | null;
    clubId: number;

    shouldFetchData: boolean;

    colors: Object;

    state = {
        imageModalVisible: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;

        if (this.props.route.params.data !== undefined && this.props.route.params.categories !== undefined) {
            this.displayData = this.props.route.params.data;
            this.categories = this.props.route.params.categories;
            this.clubId = this.props.route.params.data.id;
            this.shouldFetchData = false;
        } else {
            this.displayData = {};
            this.categories = null;
            this.clubId = this.props.route.params.clubId;
            this.shouldFetchData = true;
            console.log(this.clubId);
        }
    }

    componentDidMount(): * {
        this.props.navigation.setOptions({title: this.displayData.name})
    }

    getCategoryName(id: number) {
        if (this.categories !== null) {
            for (let i = 0; i < this.categories.length; i++) {
                if (id === this.categories[i].id)
                    return this.categories[i].name;
            }
        }
        return "";
    }

    getCategoriesRender(categories: Array<number | null>) {
        if (this.categories === null)
            return null;

        let final = [];
        for (let i = 0; i < categories.length; i++) {
            let cat = categories[i];
            if (cat !== null) {
                final.push(
                    <Chip
                        style={{marginRight: 5}}
                        key={i.toString()}>
                        {this.getCategoryName(cat)}
                    </Chip>
                );
            }
        }
        return <View style={{flexDirection: 'row', marginTop: 5}}>{final}</View>;
    }

    getManagersRender(resp: Array<string>) {
        let final = [];
        for (let i = 0; i < resp.length; i++) {
            final.push(<Paragraph key={i.toString()}>{resp[i]}</Paragraph>)
        }
        const hasManagers = resp.length > 0;
        return (
            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Title
                    title={i18n.t('clubs.managers')}
                    subtitle={hasManagers ? i18n.t('clubs.managersSubtitle') : i18n.t('clubs.managersUnavailable')}
                    left={(props) => <Avatar.Icon
                        {...props}
                        style={{backgroundColor: 'transparent'}}
                        color={hasManagers ? this.colors.success : this.colors.primary}
                        icon="account-tie"/>}
                />
                <Card.Content>
                    {final}
                </Card.Content>
            </Card>
        );
    }

    getScreen = (data: Object) => {
        data = FakeClub;

        return (
            <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                {this.getCategoriesRender(data.category)}
                {data.logo !== null ?
                    <View style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                        <ImageModal
                            resizeMode="contain"
                            imageBackgroundColor={this.colors.background}
                            style={{
                                width: 300,
                                height: 300,
                            }}
                            source={{
                                uri: data.logo,
                            }}
                        /></View>
                    : <View/>}

                {data.description !== null ?
                    // Surround description with div to allow text styling if the description is not html
                    <Card.Content>
                        <HTML html={"<div>" + data.description + "</div>"}
                              tagsStyles={{
                                  p: {color: this.colors.text,},
                                  div: {color: this.colors.text}
                              }}
                              onLinkPress={openWebLink}/>
                    </Card.Content>
                    : <View/>}
                {this.getManagersRender(data.responsibles)}
            </ScrollView>
        );
    };

    render() {
        if (this.shouldFetchData)
            return <AuthenticatedScreen
                {...this.props}
                links={[
                    {
                        link: 'clubs/list/' + this.clubId,
                        mandatory: false,
                    }
                ]}
                renderFunction={this.getScreen}
            />;
        else
            return this.getScreen(this.displayData);
    }
}

export default withTheme(ClubDisplayScreen);
