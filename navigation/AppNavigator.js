import {createAppContainer, createStackNavigator} from 'react-navigation';

import MainDrawerNavigator from './MainDrawerNavigator';
import ProximoListScreen from '../screens/Proximo/ProximoListScreen';


export default createAppContainer(
    createStackNavigator({
            Main: MainDrawerNavigator,
            ProximoListScreen: {screen: ProximoListScreen},
        },
        {
            initialRouteName: "Main",
            mode: 'card',
            headerMode: "none"
        })
);
