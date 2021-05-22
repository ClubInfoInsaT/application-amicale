import React from 'react';
import CustomIntroSlider from '../../components/Overrides/CustomIntroSlider';
import Update from '../../constants/Update';
import { usePreferences } from '../../context/preferencesContext';
import AprilFoolsManager from '../../managers/AprilFoolsManager';
import {
  getPreferenceBool,
  getPreferenceNumber,
  GeneralPreferenceKeys,
} from '../../utils/asyncStorage';

export default function IntroScreen() {
  const { preferences, updatePreferences } = usePreferences();

  const onDone = () => {
    updatePreferences(GeneralPreferenceKeys.showIntro, false);
    updatePreferences(GeneralPreferenceKeys.updateNumber, Update.number);
    updatePreferences(GeneralPreferenceKeys.showAprilFoolsStart, false);
  };

  const showIntro =
    getPreferenceBool(GeneralPreferenceKeys.showIntro, preferences) !== false;

  const isUpdate =
    getPreferenceNumber(GeneralPreferenceKeys.updateNumber, preferences) !==
      Update.number && !showIntro;

  const isAprilFools =
    AprilFoolsManager.getInstance().isAprilFoolsEnabled() &&
    getPreferenceBool(
      GeneralPreferenceKeys.showAprilFoolsStart,
      preferences
    ) !== false &&
    !showIntro;

  return (
    <CustomIntroSlider
      onDone={onDone}
      isUpdate={isUpdate}
      isAprilFools={isAprilFools}
    />
  );
}
