// @flow

import {createAppContainer} from 'react-navigation';
import {createDrawerNavigatorWithInitialRoute} from './DrawerNavigator';


/**
 * Create a stack navigator using the drawer to handle navigation between screens
 */
function createAppContainerWithInitialRoute(initialRoute: string) {
    return createAppContainer(createDrawerNavigatorWithInitialRoute(initialRoute));
}

export {createAppContainerWithInitialRoute};
