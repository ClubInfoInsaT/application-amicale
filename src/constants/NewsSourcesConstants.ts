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

const ICON_AMICALE = require('../../assets/amicale.png');
const ICON_CAMPUS = require('../../assets/android.icon.png');

export type NewsSourceType = {
  icon: number;
  name: string;
};

export type AvailablePages = 'amicale.deseleves' | 'campus.insat';

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
