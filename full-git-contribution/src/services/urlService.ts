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
    const compressedData = {
      f: firstName,
      l: lastName,
      r: readonly,
      u: users.map(user => ({
        p: user.platform,
        n: user.username,
        t: user.token
      }))
    };
    
    const encoded = btoa(JSON.stringify(compressedData));
    return `/contributions/${encoded}`;
  }

  static decodeURL(encodedData: string): { users: User[], firstName: string, lastName: string, readonly: boolean } {
    try {
      const decoded = JSON.parse(atob(encodedData));
      return {
        firstName: decoded.f,
        lastName: decoded.l,
        readonly: decoded.r || false,
        users: decoded.u.map((u: any) => ({
          platform: u.p,
          username: u.n,
          token: u.t,
          id: Math.random()
        }))
      };
    } catch (error) {
      console.error('Erreur lors du décodage de l\'URL:', error);
      return { users: [], firstName: '', lastName: '', readonly: false };
    }
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