// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";
import MapboxGL from "@react-native-mapbox-gl/maps";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

MapboxGL.setAccessToken("sk.eyJ1IjoiYW1pY2FsZS1pbnNhdCIsImEiOiJja2JpM212Z3QwYmxmMnhsc3RxZWYza2Q5In0.og84RKRa6-vr3qRA1qU9Aw");

const layerStyles = {
    smileyFace: {
        fillAntialias: true,
        fillColor: 'white',
        fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
    },
};

/**
 * Class defining the app's map screen.
 */
class MapScreen extends React.Component<Props> {

    map : { current: null | MapboxGL.MapView };

    constructor() {
        super();
        this.map = React.createRef();
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapboxGL.MapView
                    style={{flex: 1}}
                    styleURL={MapboxGL.StyleURL.Outdoors}
                    ref={this.map}
                    surfaceView={true}
                    onPress={async () => {
                        const center = await this.map.current.getCenter();
                        console.log(center);
                    }}
                >
                    <MapboxGL.Camera
                        zoomLevel={15}
                        centerCoordinate={[1.4669608, 43.5698867]}
                    />
                </MapboxGL.MapView>
            </View>
        );
    }
}

export default withTheme(MapScreen);
