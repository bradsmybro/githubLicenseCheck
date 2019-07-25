const axios = require("axios");
const licenses = require("./licenses");
const create_branch = require("./branch");
const commits = require("./commit");
const pulls = require("./pull");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] =
  "Bearer 2124235bd4a6ee4e7b016346e0a9263358d5e59b";

//Type of user that is being looked for
const desired_type = "Organization";

function handle_error(error) {
  console.log("Error with API call");
  console.log(error.response.config.url);
  console.log(error.response.status + " " + error.response.statusText);
  console.log(error.response.data.message);
}

async function is_desired(name) {
  let data = {};
  try {
    data = await axios.get("/orgs/" + name).catch(function(error) {
      handle_error(error);
      return false;
    });
  } catch (error) {
    return false;
  }
  if (data === false) {
    return false;
  }

  data = data.data;

  if (data.type != desired_type) {
    console.log(name + " is not an Organization it is " + data.type);
    return false;
  } else {
    return true;
  }
}

async function repo_check(name, branch) {
  let no_license = [];
  if (await is_desired(name)) {
    no_license = await licenses.check_license(name);
    if (no_license.length > 0) {
      for (let repo in no_license) {
        console.log("No license found for " + no_license[repo].name);
        let creation = await create_branch.create_branch(
          no_license[repo],
          branch
        );
        if (creation != false) {
          let commit = await commits.push_commit(no_license[repo], branch);
          if (commit != false) {
            let pull = await pulls.pull_request(no_license[repo], branch);
            if (pull != false) {
              console.log("MIT license pull request added");
            }
          }
        }
      }
    }
  }
}

const args = process.argv.slice(2);

//Takes three values organization name, new branch name, and Personal access tokens

if (args.length > 3) {
  console.log(
    "Only three arguements can be accepts. Please follow this format node.js repo_check.js organization branch token"
  );
  process.exit(1);
}
let name = args[0];
let new_branch = args[1];
let token = args[2];
axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token;
exports.token = token;
//Values to take in from command line, auth token, org name, new branch name
repo_check(name, new_branch);
