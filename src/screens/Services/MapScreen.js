// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";
import MapboxGL from "@react-native-mapbox-gl/maps";
import exampleIcon from '../../../assets/icon-notification.png';

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

type State = {
    featureCollection: Array<Object>,
}

MapboxGL.setAccessToken("sk.eyJ1IjoiYW1pY2FsZS1pbnNhdCIsImEiOiJja2JpM212Z3QwYmxmMnhsc3RxZWYza2Q5In0.og84RKRa6-vr3qRA1qU9Aw");

const styles = {
    icon: {
        iconImage: exampleIcon,
        iconAllowOverlap: true,
    },
};

const FEATURES = [{
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [1.4669608, 43.5698867],
    }
}]

/**
 * Class defining the app's map screen.
 */
class MapScreen extends React.Component<Props, State> {

    map: { current: null | MapboxGL.MapView };

    constructor() {
        super();
        this.map = React.createRef();

        this.state = {
            featureCollection: [],
        };
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);

    }

    onSymbolPress = (feature) => {
        console.log("coucou");
    }


    onSourceLayerPress = ({features, coordinates, point}) => {
        console.log(
            'You pressed a layer here are your features:',
            features,
            coordinates,
            point,
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapboxGL.MapView
                    style={{flex: 1}}
                    ref={this.map}
                    styleURL={MapboxGL.StyleURL.Outdoors}
                    surfaceView={true}
                    onPress={(e) => {
                        console.log(e)
                    }}
                >
                    <MapboxGL.Camera
                        zoomLevel={15}
                        centerCoordinate={[1.4669608, 43.5698867]}
                        pitch={30}
                    />
                    {/*<MapboxGL.ShapeSource*/}
                    {/*    id="symbolLocationSource"*/}
                    {/*    shape={{ type: 'FeatureCollection', features: FEATURES }}*/}
                    {/*>*/}
                    {/*    <MapboxGL.SymbolLayer*/}
                    {/*        id="symbolLocationSymbols"*/}
                    {/*        minZoomLevel={15}*/}
                    {/*        style={styles.icon}*/}
                    {/*    />*/}
                    {/*</MapboxGL.ShapeSource>*/}
                </MapboxGL.MapView>
            </View>
        );
    }
}

export default withTheme(MapScreen);
