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

import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import CardList from '../../components/Lists/CardList/CardList';
import { ServiceCategoryType } from '../../utils/Services';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../navigation/MainNavigator';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.ServicesSection>;

function ServicesSectionScreen(props: Props) {
  let finalDataset: null | ServiceCategoryType = null;
  const nav = useNavigation();

  if (props.route.params.data) {
    finalDataset = props.route.params.data;
  }

  useLayoutEffect(() => {
    if (finalDataset) {
      nav.setOptions({
        headerTitle: finalDataset.title,
      });
    }
  }, [finalDataset, nav]);

  if (!finalDataset) {
    return null;
  }
  return <CardList dataset={finalDataset.content} isHorizontal={false} />;
}

export default ServicesSectionScreen;
