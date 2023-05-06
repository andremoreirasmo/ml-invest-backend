export enum PeriodEnum {
  oneDay,
  fiveDays,
  oneMonth,
  oneYear,
  fiveYears,
  max,
}

export type keyofPeriodEnum = keyof typeof PeriodEnum;

export class PeriodUtil {
  static getInterval(e: PeriodEnum): string {
    switch (e) {
      case PeriodEnum.oneDay:
        return '1m';

      case PeriodEnum.fiveDays:
        return '60m';

      case PeriodEnum.oneMonth:
        return '1d';

      case PeriodEnum.oneYear:
        return '1wk';

      case PeriodEnum.fiveYears:
      case PeriodEnum.max:
        return '1mo';

      default:
        return '60m';
    }
  }

  static getRange(e: PeriodEnum): string {
    switch (e) {
      case PeriodEnum.oneDay:
        return '1d';

      case PeriodEnum.fiveDays:
        return '5d';

      case PeriodEnum.oneMonth:
        return '1mo';

      case PeriodEnum.oneYear:
        return '1y';

      case PeriodEnum.fiveYears:
        return '5y';

      case PeriodEnum.max:
        return 'max';

      default:
        return '1d';
    }
  }
}
