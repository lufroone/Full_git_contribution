import axios from 'axios';

interface ContributionDay {
  date: string;
  count: number;
}

const PER_PAGE = 100;

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
    let page_counter = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const eventsResponse = await axios.get(
        'https://gitlab.com/api/v4/events',
        {
          headers,
          params: {
            after: getOneYearAgo(),
            per_page: PER_PAGE,
            page: page_counter,
            sort: 'desc'
          }
        }
      );

      const events = eventsResponse.data;
      //console.log(eventsResponse);

      events.forEach((event: any) => {
        if (!event || !event.created_at) return;

        const date = new Date(event.created_at).toISOString().split('T')[0];
        
        if (event.push_data && event.push_data.commit_count) {
          contributionMap.set(date, (contributionMap.get(date) || 0) + event.push_data.commit_count);
        } else {
          contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
        }
      });

      page_counter++;
      
      if (events.length === 0 || events.length < PER_PAGE || page_counter > 10)
        hasMoreData = false;
    }

    const contributions = Array.from(contributionMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

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