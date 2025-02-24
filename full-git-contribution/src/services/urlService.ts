import { User } from '../types';

export class UrlService {
  static encodeUserData(user: User, firstName: string, lastName: string, readonly: boolean = false): string {
    const data = `${user.platform}:${user.username}:${firstName}:${lastName}${user.token ? ':' + user.token : ''}:${readonly}`;
    return btoa(data);
  }

  static decodeUserData(encodedString: string): { 
    user: User, 
    firstName: string, 
    lastName: string,
    readonly: boolean 
  } {
    const decodedString = atob(encodedString);
    const [platform, username, firstName, lastName, token, readonly] = decodedString.split(':');
    return {
      user: {
        id: 0,
        platform: platform as 'github' | 'gitlab',
        username: username || '',
        token,
        firstName: firstName || '',
        lastName: lastName || ''
      },
      firstName: firstName || '',
      lastName: lastName || '',
      readonly: readonly === 'true'
    };
  }

  static updateURL(users: User[], firstName: string, lastName: string, readonly: boolean = false): string {
    const userParams = users.map(user => 
      this.encodeUserData(user, firstName, lastName, readonly)
    ).join(',');
    return `/contributions/${userParams}`;
  }

  static getReadOnlyUrl(users: User[], firstName: string, lastName: string): string {
    return `${window.location.origin}${this.updateURL(users, firstName, lastName, true)}`;
  }

  static parseUrlUsers(urlUsers: string | undefined): {
    users: User[],
    firstName: string,
    lastName: string,
    readonly: boolean
  } {
    if (!urlUsers) {
      return { users: [], firstName: '', lastName: '', readonly: false };
    }

    const decoded = urlUsers.split(',').map(encodedString => this.decodeUserData(encodedString));
    if (decoded.length === 0) {
      return { users: [], firstName: '', lastName: '', readonly: false };
    }

    const users = decoded.map((data, index) => ({
      ...data.user,
      id: index + 1
    }));

    return {
      users,
      firstName: decoded[0].firstName,
      lastName: decoded[0].lastName,
      readonly: decoded[0].readonly
    };
  }
} 