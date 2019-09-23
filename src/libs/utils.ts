import lowercaseKeys from 'lowercase-keys';
import { RSVPEvent, Event, Group, User } from '@/interfaces/map';

const groupMock: Group = {
  city: '',
  countrycode: '',
  name: '',
};

const eventMock: Event = {
  url: '',
};

const userMock: User = {
  name: '',
};

const checkString = (data: RSVPEvent | string) =>
  typeof data === 'string' ? JSON.parse(data) : data;

const lowercaseObj = (obj: RSVPEvent) => {
  const lower: RSVPEvent|any = lowercaseKeys((obj as any));
  lower.group = lower.group ? lowercaseKeys((lower.group as any)) : groupMock;
  lower.event = lower.event ? lowercaseKeys((lower.event as any)) : eventMock;
  lower.user = lower.user ? lowercaseKeys((lower.user as any)) : userMock;
  return lower;
};

export {
  lowercaseObj,
  checkString,
};
