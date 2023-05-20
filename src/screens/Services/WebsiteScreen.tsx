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
import { StackScreenProps } from '@react-navigation/stack';
import WebViewScreen from '../../components/Screens/WebViewScreen';
import BasicLoadingScreen from '../../components/Screens/BasicLoadingScreen';
import Urls from '../../constants/Urls';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/core';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.Website>;

const ENABLE_MOBILE_STRING =
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

const AVAILABLE_ROOMS_STYLE =
  '<style>body,body>.container2{padding-top:0;width:100%}b,body>.container2>h1,body>.container2>h3,br,header{display:none}.table-bordered td,.table-bordered th{border:none;border-right:1px solid #dee2e6;border-bottom:1px solid #dee2e6}.table{padding:0;margin:0;width:200%;max-width:200%;display:block}tbody{display:block;width:100%}thead{display:block;width:100%}.table tbody tr,tbody tr[bgcolor],thead tr{width:100%;display:inline-flex}.table tbody td,.table thead td[colspan]{padding:0;flex:1;height:50px;margin:0}.table tbody td[bgcolor=white],.table thead td,.table>tbody>tr>td:nth-child(1){flex:0 0 150px;height:50px}</style>';
const BIB_STYLE =
  '<style>.hero-unit,.navbar,footer{display:none}.hero-unit-form,.hero-unit2,.hero-unit3{background-color:#fff;box-shadow:none;padding:0;margin:0}.hero-unit-form h4{font-size:2rem;line-height:2rem}.btn{font-size:1.5rem;line-height:1.5rem;padding:20px}.btn-danger{background-image:none;background-color:#be1522}.table{font-size:.8rem}.table td{padding:0;height:18.2333px;border:none;border-bottom:1px solid #c1c1c1}.table td[style="max-width:55px;"]{max-width:110px!important}.table-bordered{min-width:50px}th{height:50px}.table-bordered{border-collapse:collapse}</style>';

const BIB_BACK_BUTTON =
  "<div style='width: 100%; display: flex'>" +
  `<a style='margin: auto' href='${Urls.websites.bib}'>` +
  "<button id='customBackButton' class='btn btn-primary'>Retour</button>" +
  '</a>' +
  '</div>';

const injectedJS = {
  [Urls.websites.availableRooms]:
    `document.querySelector('head').innerHTML += '${ENABLE_MOBILE_STRING}';` +
    `document.querySelector('head').innerHTML += '${AVAILABLE_ROOMS_STYLE}'; true;`,
  [Urls.websites.bib]:
    `document.querySelector('head').innerHTML += '${ENABLE_MOBILE_STRING}';` +
    `document.querySelector('head').innerHTML += '${BIB_STYLE}';` +
    'if ($(".hero-unit-form").length > 0 && $("#customBackButton").length === 0)' +
    `$(".hero-unit-form").append("${BIB_BACK_BUTTON}");true;`,
  [Urls.websites.sosInfra]:
    `document.querySelector("#ResponsiveNavigationHandle").style.top = "unset";` +
    `document.querySelector("#Navigation").style.paddingTop = "100px";`,
};

const customPaddingFunctions = {
  [Urls.websites.bluemind]: (padding: number): string => {
    return (
      `$('head').append('${ENABLE_MOBILE_STRING}');` +
      `$('.minwidth').css('top', ${padding}` +
      "$('#mailview-bottom').css('min-height', 500);"
    );
  },
  [Urls.websites.wiketud]: (padding: number): string => {
    return (
      `$('#p-logo-text').css('top', 10 + ${padding});` +
      `$('#site-navigation h2').css('top', 10 + ${padding});` +
      `$('#site-tools h2').css('top', 10 + ${padding});` +
      `$('#user-tools h2').css('top', 10 + ${padding});`
    );
  },
};

function WebsiteScreen(props: Props) {
  const nav = useNavigation();

  const params = props.route.params;

  let host = '';
  let url = '';
  let title = '';
  if (params) {
    host = params.host;
    title = params.title;
    let { path } = params;
    if (host && path) {
      // Just in case the path has the host in it
      path = path.replace(host, '');
      url = host + path;
    } else {
      url = host;
    }
  }

  useLayoutEffect(() => {
    nav.setOptions({ title });
  }, [nav, title]);

  let injectedJavascript = '';
  let customPadding = null;
  if (host && injectedJS[host]) {
    injectedJavascript = injectedJS[host];
  }
  if (host && customPaddingFunctions[host]) {
    customPadding = customPaddingFunctions[host];
  }
  if (url) {
    return (
      <WebViewScreen
        url={url}
        initialJS={injectedJavascript}
        customPaddingFunction={customPadding}
      />
    );
  }
  return <BasicLoadingScreen />;
}

export default WebsiteScreen;
