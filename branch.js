//Handles getting main branch sha and creating a new branch for the commit
const axios = require("axios");
const token = require("./repo_check");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;

//create a new branch to commit the license to
exports.create_branch = async function create_branch(repo_data, branch) {
  try {
    //Gets the sha for the current head branch
    let response = await axios
      .get(
        "/repos/" + repo_data.full_name + "/git/refs/heads/" + repo_data.branch
      )
      .catch(function(error) {
        handle_error(error);
        return false;
      });

    if (response === false) {
      return false;
    } else {
      let build_response = await build_branch(repo_data, branch, response);
      if (build_response == false) {
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

async function build_branch(repo_data, branch, response) {
  let body = {
    ref: "refs/heads/" + branch,
    sha: response.data.object.sha
  };
  try {
    let branch_response = await axios
      .post("repos/" + repo_data.full_name + "/git/refs", body)
      .catch(function(error) {
        //If the branch already exists try again with 1 added to the end
        if (error.response.data.message == "Reference already exists") {
          console.log(
            "Branch name already in use please select a new branch name and run again"
          );
        } else {
          handle_error(error);
          return false;
        }
      });

    if (branch_response === false) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function handle_error(error) {
  console.log("Error with API call");
  console.log(error.response.config.url);
  console.log(error.response.status + " " + error.response.statusText);
  console.log(error.response.data.message);
}
