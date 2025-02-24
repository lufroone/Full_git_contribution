import axios from 'axios';

interface ContributionDay {
  date: string;
  count: number;
}

export const fetchGitlabContributions = async (username: string, token?: string): Promise<ContributionDay[]> => {
  try {
    if (!token) {
      console.warn('Token GitLab requis pour récupérer les contributions');
      return [];
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': token
    };

    const contributionMap = new Map<string, number>();
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const eventsResponse = await axios.get(
        'https://gitlab.com/api/v4/events',
        {
          headers,
          params: {
            after: getOneYearAgo(),
            per_page: 100,
            page: page,
            sort: 'desc'
          }
        }
      );

      const events = eventsResponse.data;
      console.log(`Événements GitLab récupérés (page ${page}):`, events.length);

      if (events.length === 0) {
        hasMoreData = false;
        break;
      }

      events.forEach((event: any) => {
        if (!event || !event.created_at) return;

        const date = new Date(event.created_at).toISOString().split('T')[0];
        
        if (event.push_data && event.push_data.commit_count) {
          contributionMap.set(date, (contributionMap.get(date) || 0) + event.push_data.commit_count);
        } else {
          contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
        }
      });

      page++;
      
      // Limite de sécurité pour éviter une boucle infinie
      if (page > 10) {
        hasMoreData = false;
      }
    }

    const contributions = Array.from(contributionMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Contributions GitLab finales:', contributions);
    return contributions;

  } catch (error) {
    console.error('Erreur lors de la récupération des contributions GitLab:', error);
    return [];
  }
};

const getOneYearAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString();
}; 