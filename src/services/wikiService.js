import axios from 'axios';

const BASE_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export const getWikiSummary = async (query) => {
  try {
    // This is a mock implementation
    // In a real app, you would use:
    // const formattedQuery = query.trim().replace(/\s+/g, '_');
    // const response = await axios.get(`${BASE_URL}${formattedQuery}`);
    // return response.data.extract;
    
    // Mock response for demo purposes
    return {
      extract: `${query} is a topic found on Wikipedia. This is a simulated response. In a real application, 
                this would contain an actual summary from Wikipedia's API.`
    };
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    throw new Error('Failed to fetch information from Wikipedia');
  }
};

export const formatWikiResponse = (data) => {
  return data.extract;
}; 