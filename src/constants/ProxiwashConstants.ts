/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

export default {
  machineStates: {
    AVAILABLE: 0,
    RUNNING: 1,
    RUNNING_NOT_STARTED: 2,
    FINISHED: 3,
    UNAVAILABLE: 4,
    ERROR: 5,
    UNKNOWN: 6,
  },
  stateIcons: [
    'radiobox-blank',
    'progress-check',
    'alert-circle-outline',
    'check-circle',
    'alert-octagram-outline',
    'alert',
    'help-circle-outline',
  ],
  washinsa: {
    id: 'washinsa',
    title: 'screens.proxiwash.washinsa.title',
    subtitle: 'screens.proxiwash.washinsa.subtitle',
    description: 'screens.proxiwash.washinsa.description',
    tarif: 'screens.proxiwash.washinsa.tariff',
    paymentMethods: 'screens.proxiwash.washinsa.paymentMethods',
    icon: 'school-outline',
    url:
      'https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/washinsa_data.json',
  },
  tripodeB: {
    id: 'tripodeB',
    title: 'screens.proxiwash.tripodeB.title',
    subtitle: 'screens.proxiwash.tripodeB.subtitle',
    description: 'screens.proxiwash.tripodeB.description',
    tarif: 'screens.proxiwash.tripodeB.tariff',
    paymentMethods: 'screens.proxiwash.tripodeB.paymentMethods',
    icon: 'domain',
    url:
      'https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/tripode_b_data.json',
  },
};
