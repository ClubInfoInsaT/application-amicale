import React from 'react';
import CustomIntroSlider from '../../components/Overrides/CustomIntroSlider';
import Update from '../../constants/Update';
import { usePreferences } from '../../context/preferencesContext';
import AprilFoolsManager from '../../managers/AprilFoolsManager';
import {
  getPreferenceBool,
  getPreferenceNumber,
  PreferenceKeys,
} from '../../utils/asyncStorage';

export default function IntroScreen() {
  const { preferences, updatePreferences } = usePreferences();

  const onDone = () => {
    updatePreferences(PreferenceKeys.showIntro, false);
    updatePreferences(PreferenceKeys.updateNumber, Update.number);
    updatePreferences(PreferenceKeys.showAprilFoolsStart, false);
  };

  const showIntro =
    getPreferenceBool(PreferenceKeys.showIntro, preferences) !== false;

  const isUpdate =
    getPreferenceNumber(PreferenceKeys.updateNumber, preferences) !==
      Update.number && !showIntro;

  const isAprilFools =
    AprilFoolsManager.getInstance().isAprilFoolsEnabled() &&
    getPreferenceBool(PreferenceKeys.showAprilFoolsStart, preferences) !==
      false &&
    !showIntro;

  return (
    <CustomIntroSlider
      onDone={onDone}
      isUpdate={isUpdate}
      isAprilFools={isAprilFools}
    />
  );
}
