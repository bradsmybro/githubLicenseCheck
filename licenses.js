const axios = require("axios");
const token = require("./repo_check");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;

//take in string and parse the last page
function get_last_page(link) {
  link = link.split("page=")[4];
  link = parseInt(link.split(">")[0]);
  return link;
}

//Handles the api call
async function list_repos(name, page = 1) {
  let data = await axios
    .get("/orgs/" + name + "/repos?per_page=100&page=" + page)
    .catch(function(error) {
      handle_error(error);
      return false;
    });
  return data;
}

//Processes the api call and checks if additional calls to the api will be required
async function check_repos(name) {
  let repo_list = [];
  let data = await list_repos(name);
  if (data != false) {
    repo_list = data.data;
    //If this exists then there are multiple pages of results
    if (data.headers.link) {
      let last_page = get_last_page(data.headers.link);
      console.log(last_page);
      for (let i = 2; i <= last_page; i++) {
        let new_data = await list_repos(name, i);
        //adds the new data to the end of the old array
        Array.prototype.push.apply(repo_list, new_data.data);
      }
    }
  }
  return repo_list;
}

//Checks to see if the repo has a license
exports.check_license = async function check_license(name) {
  let repos = await check_repos(name);

  let no_license = [];

  for (repo in repos) {
    let license = repos[repo].license;
    if (license === null) {
      no_license.push({
        full_name: repos[repo].full_name,
        name: repos[repo].name,
        branch: repos[repo].default_branch,
        permissions: repos[repo].permissions,
        owner: repos[repo].owner.login
      });
    }
  }
  return no_license;
};

function handle_error(error) {
  console.log("Error with API call");
  console.log(error.response.config.url);
  console.log(error.response.status + " " + error.response.statusText);
  console.log(error.response.data.message);
}
