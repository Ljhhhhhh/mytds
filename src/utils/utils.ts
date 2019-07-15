import { parse } from 'qs';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('authority', JSON.stringify(proAuthority));
}

function downloadFile(blob: Blob, filename: string = 'file.xlsx') {
  const objectURL = window.URL.createObjectURL(blob);
  window.URL.revokeObjectURL(objectURL);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click()
}

function numberFormat(number: number | string) {
  const value = +number;
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + '万'
  }
  return value
}

function transformBr(str: string, need: 'html' | 'string' = 'html') {
  if (!str) return '';
  if (need === 'string') {
    return str.replace(/\<br\/\>/g, '\n')
  }
  if (need === 'html') {
    return str.replace(/\n/g,"<br/>")
  }
  return str;
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl, getPageQuery, setAuthority, downloadFile, numberFormat, transformBr };
