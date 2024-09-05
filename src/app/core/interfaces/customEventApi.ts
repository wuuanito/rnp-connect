import { EventApi } from '@fullcalendar/core';

export interface CustomEventApi extends EventApi {
  extendedProps: {
    description?: string;
  };
}
