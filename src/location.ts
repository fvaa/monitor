import * as Url from 'url-parse';

export interface locationSchema {
  pathname: string,
  query: object,
  href: string,
}

export default function LocationFormat(prefix: string): { parse: Function } {
  if (!prefix.endsWith('/')) prefix += '/';
  const prefixLength: number = prefix.length;
  return {
    parse(url: string): locationSchema {
      const index: number = url.indexOf(prefix);
      if (index !== 0) throw new Error('url need prefix of ' + prefix);
      url = url.substring(prefixLength - 1) || '/';
      const request = new Url(url, true);
      return {
        href: request.href,
        pathname: request.pathname,
        query: request.query || {}
      }
    }
  }
}