/* eslint-disable no-console */
const axios = require('axios');

const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,jobTitle,country',
};

async function callMsGraph(accessToken) {
  const options = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios.get(graphConfig.graphMeEndpoint, options)
    .then(response => response.data)
    .catch(error => console.error(error));
}

module.exports = {
  callMsGraph,
};
