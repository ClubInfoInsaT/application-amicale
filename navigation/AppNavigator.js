import {createAppContainer, createStackNavigator} from 'react-navigation';

import MainDrawerNavigator from './MainDrawerNavigator';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';
import AboutDependenciesScreen from '../screens/About/AboutDependenciesScreen';

export default createAppContainer(
    createStackNavigator({
            Main: MainDrawerNavigator,
            ProximoListScreen: {screen: ProximoListScreen},
            AboutDependenciesScreen: {screen: AboutDependenciesScreen},
        },
        {
            initialRouteName: "Main",
            mode: 'card',
            headerMode: "none"
        })
);
