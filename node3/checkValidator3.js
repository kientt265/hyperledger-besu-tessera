const axios = require('axios');

// Function to list all current validators
const listValidators = async () => {
  try {
    const response = await axios.post('http://localhost:8545', {
      jsonrpc: '2.0',
      method: 'clique_getSigners',
      params: ['latest'],  // Use 'latest' to get the current list of validators
      id: 1,
    });

    if (response.data.error) {
      console.error('Error listing validators:', response.data.error);
    } else {
      console.log('Current Validators:', response.data.result);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Example usage
listValidators();