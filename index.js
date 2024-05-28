// bring dotenv
require("dotenv").config();


console.log("hello world");

async function fetchRepos() {
  let page = 1;

  async function fetchPage(page) {
    return fetch(`https://api.github.com/users/${process.env.USER}/repos?per_page=10&page=${page}`, {
        method: "GET",
        headers: {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/vnd.github+json",
        },
      })
  }

  let data = [];
  let initialResponse = await fetchPage(page);
  let responseData = await initialResponse.json();
  data.push(...responseData);

  while(initialResponse.headers.get('Link') && initialResponse.headers.get('Link').includes('rel="next"')){
    page++;
    initialResponse = await fetchPage(page);
    responseData = await initialResponse.json();
    data.push(...responseData);
  }

  console.log("how many repos: " + data.length);
  let totalLength = 0;
  data.forEach(async (repo, index) => {
    let commits = await fetchCommits(repo.url);
    totalLength += commits.length;
    console.log("total: " + totalLength)
  });
}

async function fetchCommits(url) {
  let page = 1;
  async function fetchPage(page) {
    return fetch(`${url}/commits?per_page=100&page=${page}`, {
        method: "GET",
        headers: {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/vnd.github+json",
        },
      })
  }

  let data = [];
  let initialResponse = await fetchPage(page);
  let responseData = await initialResponse.json();
  data.push(...responseData);

  while(initialResponse.headers.get('Link') && initialResponse.headers.get('Link').includes('rel="next"')){
    page++;
    initialResponse = await fetchPage(page);
    responseData = await initialResponse.json();
    data.push(...responseData);
  }

  console.log(url, data.length);

  return data
}

fetchRepos();


