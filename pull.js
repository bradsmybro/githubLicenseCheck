//Submits the pull request
const axios = require("axios");
const token = require("./repo_check");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;

//Sends in the pull request
exports.pull_request = async function pull_request(repo_data, branch) {
  let branch_new = branch;
  try {
    let body = {
      title: "License Missing",
      body: "This will add a MIT license to this repository",
      base: repo_data.branch,
      head: branch_new
    };

    let response = await axios
      .post("/repos/" + repo_data.full_name + "/pulls", body)
      .catch(function(error) {
        handle_error(error);
        return false;
      });
    if (response != false) {
      return response;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

function handle_error(error) {
  console.log("Error with API call");
  console.log(error.response.config.url);
  console.log(error.response.status + " " + error.response.statusText);
  console.log(error.response.data.message);
}
