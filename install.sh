#!/bin/bash

base_dir=$(pwd)


if [[ $1 == "--android" ]]
then
  echo "Installing for Android only"
  node_install
  android_install
elif [[ $1 == "--ios" ]]
then
  echo "Installing for iOS only"
  node_install
  ios_install
elif [[ $1 == "--all" ]]
then
  echo "Installing for Android and iOS"
  node_install
  android_install
  ios_install
else
  echo "Usage: ./install.sh [mode]"
  echo "    [mode]: --android     Installs only Android dependencies"
  echo "    [mode]: --ios         Installs only iOS dependencies"
  echo "    [mode]: --all         Installs Android and iOS dependencies"
fi
exit

function ios_install {
  cd "$base_dir"/ios && pod install
}

function android_install {
  echo "Creating debug android keystore..."
  cd "$base_dir"/android/app && keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
  echo -e "Done\n"

  cd ..
  echo "Creating gradle.properties file..."
  echo "# Project-wide Gradle settings.

# IDE (e.g. Android Studio) users:
# Gradle settings configured through the IDE *will override*
# any settings specified in this file.

# For more details on how to configure your build environment visit
# http://www.gradle.org/docs/current/userguide/build_environment.html

# Specifies the JVM arguments used for the daemon process.
# The setting is particularly useful for tweaking memory settings.
# Default value: -Xmx10248m -XX:MaxPermSize=256m
# org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# When configured, Gradle will run in incubating parallel mode.
# This option should only be used with decoupled projects. More details, visit
# http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects
# org.gradle.parallel=true

# AndroidX package structure to make it clearer which packages are bundled with the
# Android operating system, and which are packaged with your app's APK
# https://developer.android.com/topic/libraries/support-library/androidx-rn
android.useAndroidX=true
# Automatically convert third-party libraries to use AndroidX
android.enableJetifier=true
# Version of flipper SDK to use with React Native
FLIPPER_VERSION=0.37.0
# This file is not included in git because it may contain secrets concerning the release key.
# To get those secrets, please contact the author at vergnet@etud.insa-toulouse.fr
" > gradle.properties
  echo -e "Done\n"
}

function node_install {
  cd "$base_dir" || exit 1
  ./clear-node-cache.sh
}



