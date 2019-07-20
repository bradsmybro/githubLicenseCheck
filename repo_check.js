const axios = require("axios");

api_config = {
  headers: {
    //Will put the api auth token or keys here?
    //Explicit request for v3 of the github api
    Accept: "application / vnd.github.v3 + json"
  }
};

//Type of user that is being looked for
const desired_type = "Organization";

const base_url = "https://api.github.com/users/";

function handle_error(error) {
  console.log("Error with API call");
  console.log(error);
}

//will get info about license for public repos
async function public_repos(name) {
  let data = await axios.get(base_url + name + "/repos").catch(function(error) {
    handle_error(error);
  });

  //returns a list of objects with public repo information
  return data.data;
}

async function check_license(name) {
  let repos = await public_repos(name);

  for (repo in repos) {
    console.log(repos[repo].license);
    let license = repos[repo].license;
    if (license === null) {
      //call the request here to get a license
      console.log("No license found for " + repos[repo].name);
    } else {
      console.log(license.name);
    }
  }
}

async function is_desired(name) {
  let data = await axios
    .get("https://api.github.com/users/" + name)
    .catch(function(error) {
      handle_error(error);
    });

  data = data.data;

  if (data.type != desired_type) {
    console.log(name + " is not an Organization it is " + data.type);
    return false;
  } else {
    return true;
  }
}

let name = "bradsmybro-test";

if (is_desired(name)) {
  check_license(name);
}
