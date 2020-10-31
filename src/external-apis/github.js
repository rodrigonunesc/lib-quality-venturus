const axios = require('axios');

const PAGE_LIMIT = 1;

const axiosIntance = axios.create({
  baseURL: process.env.GITHUB_BASE_URL || 'https://api.github.com',
  headers: {
    'User-Agent': 'lib-quality-venturus',
    Accept: 'application/vnd.github.v3+json',
    Authorization: process.env.GIT_TOKEN || 'token 4ef363721754162bf8ef9b9e17488a08884318d8',
  },
});

function getProjectDataFromApi(projectName) {
  return axiosIntance.get(`search/repositories?q=${projectName}&order=desc&per_page=${PAGE_LIMIT}`);
}

function getProjectIssuesFromApi(fullProjectName, page = 1) {
  return axiosIntance.get(`repos/${fullProjectName}/issues?per_page=100&state=open&page=${page}`);
}

function getLastPageFromLink(link) {
  return parseInt(link.split(',').pop().match(/page=\d+>/i)[0].replace(/\D/g, ''), 10);
}

function getReaminingPagesToBeProcessed(lastPage) {
  return [...new Array(lastPage + 1).keys()].splice(2, lastPage);
}

function getIssuesWithoutPullRequest(issues) {
  return issues.filter((issue) => !issue.pull_request);
}

module.exports.getProjectDataByName = async (projectName) => {
  const { data } = await getProjectDataFromApi(projectName);
  const projectData = data.items[0];
  return projectData;
};

module.exports.getOpenedProjectIssues = async (fullProjectName) => {
  const { data: issuesFirstPage, headers } = await getProjectIssuesFromApi(fullProjectName);
  if (headers.link) {
    const lastPage = getLastPageFromLink(headers.link);
    const pages = getReaminingPagesToBeProcessed(lastPage);
    const promises = pages.map((page) => getProjectIssuesFromApi(fullProjectName, page));
    const allResponses = await Promise.all(promises);
    const allIssues = issuesFirstPage.concat(...allResponses.map((response) => response.data));
    const issuesWithoutPullRequest = getIssuesWithoutPullRequest(allIssues);
    return issuesWithoutPullRequest;
  }
};
