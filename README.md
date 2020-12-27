# GitHub OAuth Client

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A server that handles [step 2 of GitHub's OAuth web application flow](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github)
so your static, serverless applications can authorize with GitHub while keeping
your client secrets secret.

## Usage

For each [GitHub OAuth App](https://github.com/settings/developers), set an
environment variable whose name is the client ID and whose value is the
corresponding client secret (in Heroku this is done with
**Settings > Config Vars** in your app dashboard).

You can also set a `PORT` variable to change the port used. If not set, it will
default to port 5000.

Run the server somewhere. Then to authenticate with it:

1. Follow [step 1 of GitHub's OAuth web application flow](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#web-application-flow).
   You should get back `code` and `state` parameters.
2. Make a `GET` request to the OAuth client. The path is your app's client ID,
   and the `code` and `state` should be passed as URL parameters.
3. The server will respond with a [JSON object with these fields](https://github.com/octokit/auth-oauth-app.js#oauth-access-token-authentication).
   You probably just need the `token` field.

For example:

```js
const CLIENT_ID = '1234567890abcdef';
const params = new URLSearchParams({ code, state }).toString();
const response = await fetch(`https://my-oauth-client-url.com/${CLIENT_ID}?${params}`);

if (response.ok) {
  const { token } = await response.json();
  console.log('Access token:', token);
}
```

### Parameters

The server supports the `code`, `redirect_uri`, and `state` parameters as
described in [step 2 of GitHub's OAuth web application flow](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#parameters-1).

## Credits

This is based on [github-secret-keeper](https://github.com/HenrikJoreteg/github-secret-keeper)
and created because I couldn't get that to work.
