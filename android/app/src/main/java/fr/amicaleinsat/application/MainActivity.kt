package fr.amicaleinsat.application

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle;
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Campus"

  // From https://github.com/software-mansion/react-native-screens?tab=readme-ov-file#android
  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState);
  }
}

