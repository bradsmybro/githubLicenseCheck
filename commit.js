//Pushes a commit to the new branch
const axios = require("axios");
const token = require("./repo_check");

axios.defaults.baseURL = "https://api.github.com";
axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;

const lic = "mit";

//Takes the license and encodes it for the commit
async function gen_license(desired_lic, name) {
  let date = new Date();
  let year = String(date.getFullYear());
  let response = await axios.get("/licenses/" + desired_lic);

  let body = response.data.body;
  body = body.replace("[year]", year);
  body = body.replace("[fullname]", name);

  return Buffer.from(body).toString("base64");
}

//Pushes the commit to the newly created branch
exports.push_commit = async function push_commit(repo_data, branch) {
  let body = {
    message: "Adding a license",
    content: await gen_license(lic, repo_data.owner),
    branch: branch
  };
  try {
    let commit = await axios
      .put("/repos/" + repo_data.full_name + "/contents/LICENSE", body)
      .catch(function(error) {
        handle_error(error);
        return false;
      });
    if (commit != false) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

function handle_error(error) {
  console.log("Error with API call");
  console.log(error.response.config.url);
  console.log(error.response.status + " " + error.response.statusText);
  console.log(error.response.data.message);
}
