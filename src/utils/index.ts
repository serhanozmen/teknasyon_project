import moment from 'moment-timezone';

const getUserLocalTime = (userTimeZone: string) => {
    const localTime = moment.tz(userTimeZone).format('YYYY-MM-DD HH:mm:ss');

    return localTime;
};

const isToday = (date: string, timezone: string) => {
    const today = moment().tz(timezone).startOf('day');
    const givenDate = moment(date).tz(timezone).startOf('day');
    return today.isSame(givenDate);
};

const getToday = (timezone: string) => {
    const now = moment.tz(timezone);
    return { now: now, today: now.clone().startOf('day') };
};

const sortDates = (dateArray: string[], timezone: string) => {
    return dateArray.sort((a, b) => {
        const dateA = moment.tz(a, timezone).valueOf();
        const dateB = moment.tz(b, timezone).valueOf();

        return dateB - dateA;
    });
};

const getDate = (date: string, timezone: string) => {
    if (!date) {
        return null;
    }

    return moment.tz(date, 'YYYY-MM-DD HH:mm:ss', timezone);
};

export { getUserLocalTime, isToday, getToday, sortDates, getDate };
