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
  stateIcons: {
    0: 'radiobox-blank',
    1: 'progress-check',
    2: 'alert-circle-outline',
    3: 'check-circle',
    4: 'alert-octagram-outline',
    5: 'alert',
    6: 'help-circle-outline',
  },
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
