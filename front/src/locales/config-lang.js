import merge from 'lodash/merge';
// date fns
import {
  fr as frFRAdapter,
} from 'date-fns/locale';

// core (MUI)
import {
  frFR as frFRCore,
} from '@mui/material/locale';
// data grid (MUI)
import {
  frFR as frFRDataGrid,
} from '@mui/x-data-grid';
// date pickers (MUI)
import {
  frFR as frFRDate,
} from '@mui/x-date-pickers/locales';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'French',
    value: 'fr',
    systemValue: merge(frFRDate, frFRDataGrid, frFRCore),
    adapterLocale: frFRAdapter,
    icon: 'flagpack:fr',
    numberFormat: {
      code: 'fr-Fr',
      currency: 'EUR',
    },
  },
  /* {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
  {
    label: 'Vietnamese',
    value: 'vi',
    systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
    adapterLocale: viVNAdapter,
    icon: 'flagpack:vn',
    numberFormat: {
      code: 'vi-VN',
      currency: 'VND',
    },
  },
  {
    label: 'Chinese',
    value: 'cn',
    systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
    adapterLocale: zhCNAdapter,
    icon: 'flagpack:cn',
    numberFormat: {
      code: 'zh-CN',
      currency: 'CNY',
    },
  },
  {
    label: 'Arabic',
    value: 'ar',
    systemValue: merge(arSDDataGrid, arSACore),
    adapterLocale: arSAAdapter,
    icon: 'flagpack:sa',
    numberFormat: {
      code: 'ar',
      currency: 'AED',
    },
  }, */
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
