// @flow

import ICON_AMICALE from '../../assets/amicale.png';
import ICON_CAMPUS from '../../assets/android.icon.png';

export type NewsSourceType = {
  icon: number,
  name: string,
};

export default {
  'amicale.deseleves': {
    icon: ICON_AMICALE,
    name: 'Amicale INSA Toulouse',
  },
  'campus.insat': {
    icon: ICON_CAMPUS,
    name: 'Application Campus',
  },
};
