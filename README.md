# githubLicenseCheck

## Description:
This code will go through all the repositories in a GitHub organization (limited by the users permissions in the org) and will submit a pull request to add the MIT license to any repository that is missing a license. This is done exclusively through the GitHub api.

## Requirements:
For this code to function the user will need to generate a GitHub personal access token. The steps required to generate that will be described below. The name of an organization and a unique branch name will also be needed for the push requests to be successful.
Node.js version 10.16.0 and npm version 6.10.1 are also required.

## Fast instructions:
1) Generate GitHub personal access token (detailed instructions below)
2) Clone the repo and install required dependencies from the package.json file
3) Use node to run the repo_check file with three parameters (org_name, branch_name, and access token)
```
node.js org_name unique_branch_name GitHub_access_token
```
4) Wait while the program runs. Any errors will be output to the console.

## Detailed Instructions:
1) Generate GitHub personal access token
   - Login to your GitHub account through your desired browser
   - Go to settings --> Developer Settings --> Personal access tokens
   - Click generate new token
        - Enter a note describing the use of the token
        - Give it permissions, this code requires at least repo permissions (check the box next to repo)
        - Make sure to copy and store the token immediately. It can only be viewed this one time.
2) Clone this repository to your machine with this string https://github.com/bradsmybro/githubLicenseCheck.git
3) Install required dependencies from the package.json file
    - Run ``` npm install ``` in the directory containing package.json
4) Run ```node repo_check.js organization_name unique_branch access_token```
    - organization_name: the name of the organization that you are checking for licenses
    - unique_branch: Any random string, but it must not be used as a branch name in any of the repos in the organization. If the branch is not unique the pull request will not succeed for the repository and an error will be output
    - access_token: token generated on github.com. Can be reused as often as desired
5) Wait for the program to finish. All repositories without a license will be output to the console as well as when the pull request is added

## Assumptions:
This code is only for organizations, if a user is entered the program will exit. 
Proper permissions are assumed. If permissions are lacking, private repos will be invisible and the program will not add pull requests.
It is assumed that a fresh branch should be used to add the license instead of an existing branch.
