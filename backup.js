const express = require("express");
const app = express();
const crypto = require("crypto");
const oauth1a = require("oauth-1.0a");
const axios = require("axios");

const CONSUMERKEY =
  "add consumer key";
const CONSUMERSECRET =
  "add consumer secret";
const TOKENKEY =
  "add token";
const TOKENSECRET =
  "add secret";
const REALM = "3883026_SB1";

const request = {
  url: "required url",
  method: "GET",
};

class Oauth1Helper {
  static getAuthHeaderForRequest(request) {
    const oauth = oauth1a({
      consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
      signature_method: "HMAC-SHA256",
      realm: REALM,
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha256", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const authorization = oauth.authorize(request, {
      key: TOKENKEY,
      secret: TOKENSECRET,
    });

    return oauth.toHeader(authorization);
  }
}

app.get("/getData", async function (req, res) {
  const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);

  const response = await axios
    .get(request.url, { headers: authHeader })
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

const port = 8000;
app.listen(port, () => console.log("App listening on port " + port));
