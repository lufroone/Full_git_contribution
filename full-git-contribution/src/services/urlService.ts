import { User } from '../types';

const BASE_URL = import.meta.env.PROD 
  ? 'https://agc.meakuumi.com'
  : 'http://localhost:3000';

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

  static encodeURL(users: User[], firstName: string, lastName: string, readonly: boolean = false): string {
    const data = {
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        readonly: readonly
      },
      accounts: users.map(user => ({
        platform: user.platform,
        username: user.username,
        token: user.token || ''
      }))
    };
    return btoa(encodeURIComponent(JSON.stringify(data)));
  }

  static decodeURL(encodedData: string): { users: User[], firstName: string, lastName: string, readonly: boolean } {
    try {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encodedData)));
        const firstName = decoded.profile?.firstName || '';
        const lastName = decoded.profile?.lastName || '';
        
        return {
          firstName,
          lastName,
          readonly: Boolean(decoded.profile?.readonly),
          users: Array.isArray(decoded.accounts) ? decoded.accounts.map((u: any) => ({
            platform: u.platform || 'github',
            username: u.username || '',
            token: u.token || '',
            id: Math.random(),
            firstName,
            lastName
          })) : []
        };
      } catch {
        const decoded = encodedData.split(',').map(str => {
          const decodedStr = atob(str);
          const [platform, username, firstName, lastName, token, readonly] = decodedStr.split(':');
          return {
            platform,
            username,
            firstName,
            lastName,
            token,
            readonly: readonly === 'true'
          };
        });

        const firstName = decoded[0]?.firstName || '';
        const lastName = decoded[0]?.lastName || '';

        return {
          firstName,
          lastName,
          readonly: decoded[0]?.readonly || false,
          users: decoded.map((d, index) => ({
            platform: d.platform as 'github' | 'gitlab',
            username: d.username || '',
            token: d.token || '',
            id: index + 1,
            firstName,
            lastName
          }))
        };
      }
    } catch (error) {
      console.error('Erreur lors du décodage de l\'URL:', error);
      return { users: [], firstName: '', lastName: '', readonly: false };
    }
  }

  static updateURL(users: User[], firstName: string, lastName: string, readonly: boolean = false): string {
    const encodedData = this.encodeURL(users, firstName, lastName, readonly);
    return `/contributions/${encodedData}`;
  }

  static getReadOnlyUrl(users: User[], firstName: string, lastName: string): string {
    const path = this.updateURL(users, firstName, lastName, true);
    return `${BASE_URL}${path}`;
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