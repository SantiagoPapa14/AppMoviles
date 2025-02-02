import WeekView, { createFixedWeekDate } from 'react-native-week-view';

const myEvents = [
    {
        id: 1,
        description: 'Event 1',
        startDate: createFixedWeekDate('Monday', 12), // Day may be passed as string
        endDate: createFixedWeekDate(1, 14), // Or as number, 1 = monday
        color: 'blue',
    },
    {
        id: 2,
        description: 'Event 2',
        startDate: createFixedWeekDate('wed', 16),
        endDate: createFixedWeekDate(3, 16, 30),
        color: 'red',
    },
];

export const TimeTable = () => (
    <WeekView
        events={myEvents}
        fixedHorizontally={true}
        // Recommended props:
        showTitle={false} // if true, shows this month and year
        numberOfDays={5} // how many days to show, default is 7
        formatDateHeader="ddd" // display short name days, e.g. Mon, Tue, etc
        pageStartAt={{ weekday: 1 }} // start week on mondays
        hoursInDisplay={15} // how many hours to show
    />
);