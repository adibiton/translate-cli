# TRANSLATOR-CLI

Translate based on azure cognitive services

### How to run this project

- Register to Azure cognitive services and get an api key.
- Create new .env file (you can copy .env-example) and fill the api key.
- From command line:
  - Run `npm install`
  - Run `node index.js <phrase>`
  - You can create a symlink in the global folder that links to the package where the npm link command was executed by running `npm link` and then `translate <phrase>` from anywhere
