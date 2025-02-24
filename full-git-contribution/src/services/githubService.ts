import axios from 'axios';

interface ContributionDay {
  date: string;
  count: number;
}

export const fetchGithubContributions = async (username: string, token?: string): Promise<ContributionDay[]> => {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v4+json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    const weeks = response.data.data.user.contributionsCollection.contributionCalendar.weeks;
    const contributions = weeks.flatMap((week: any) => 
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount
      }))
    );

    console.log('Contributions GitHub détaillées pour', username, ':', contributions);
    return contributions;

  } catch (error) {
    console.error('Erreur lors de la récupération des contributions GitHub:', error);
    return [];
  }
};
