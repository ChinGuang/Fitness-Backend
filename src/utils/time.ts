export class TimeConverter {
  static convertToMilliseconds(timeString: string): number {
    const [timeValue, timeUnit] = timeString.split(/(\d+)/).filter(Boolean);
    if (!timeValue || !timeUnit) {
      throw new Error(`Invalid time string: ${timeString}`);
    }
    const timeValueNumber = parseInt(timeValue);

    switch (timeUnit) {
      case 'ms':
        return timeValueNumber;
      case 's':
        return timeValueNumber * 1000;
      case 'm':
        return timeValueNumber * 60 * 1000;
      case 'h':
        return timeValueNumber * 60 * 60 * 1000;
      case 'd':
        return timeValueNumber * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Invalid time unit: ${timeUnit}`);
    }
  }

  static convertToSeconds(timeString: string): number {
    const [timeValue, timeUnit] = timeString.split(/(\d+)/).filter(Boolean);
    if (!timeValue || !timeUnit) {
      throw new Error(`Invalid time string: ${timeString}`);
    }
    const timeValueNumber = parseInt(timeValue);

    switch (timeUnit) {
      case 'ms':
        return timeValueNumber / 1000;
      case 's':
        return timeValueNumber;
      case 'm':
        return timeValueNumber * 60;
      case 'h':
        return timeValueNumber * 60 * 60;
      case 'd':
        return timeValueNumber * 24 * 60 * 60;
      default:
        throw new Error(`Invalid time unit: ${timeUnit}`);
    }
  }
}
