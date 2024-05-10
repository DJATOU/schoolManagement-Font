import { CalendarApi, CalendarOptions } from '@fullcalendar/common'; // Make sure these imports are correct

export interface MyCalendarOptions extends CalendarOptions {
    navLinkDayClick?: string | ((this: CalendarApi, date: Date, jsEvent: Event) => void);
}
