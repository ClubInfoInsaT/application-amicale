import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import PlanningScreen from '../screens/PlanningScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? 'ios-home'
                    : 'md-home'
            }
        />
    ),
};

const ProfileStack = createStackNavigator({
    Profile: PlanningScreen,
});

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? 'ios-people'
                    : 'md-people'
            }
        />
    ),
};


export default createMaterialBottomTabNavigator(
    {
        Home: HomeStack,
        Profile: ProfileStack
    }, {
        initialRouteName: 'Home',
        shifting: true,
        activeColor: Colors.tabIconSelected,
        inactiveColor: Colors.tabIconDefault,
        barStyle: {backgroundColor: Colors.mainColor},
    }
);
