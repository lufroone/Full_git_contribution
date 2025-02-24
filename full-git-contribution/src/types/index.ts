export interface BaseUser {
  platform: 'github' | 'gitlab';
  username: string;
  token?: string;
  id: number;
}

export interface User extends BaseUser {
  firstName: string;
  lastName: string;
}

export interface ContributionDay {
  date: string;
  count: number;
} 