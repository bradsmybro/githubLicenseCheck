const axios = require("axios");
const token = require("./repo_check");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;

//will get info about license for public repos
async function check_repos(name) {
  let data = await axios.get("/orgs/" + name + "/repos").catch(function(error) {
    handle_error(error);
  });

  //returns a list of objects with public repo information
  return data.data;
}

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
