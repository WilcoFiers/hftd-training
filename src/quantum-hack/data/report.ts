// @ts-ignore
import report from './report.yml';
import t from './template'

export const header = t(report.header);
export const footer = t(report.footer);
export const tick_begin = t(report.tick_begin);
export const tick_end = t(report.tick_end);