const express = require("express");
const app = express();
const crypto = require("crypto");
const oauth1a = require("oauth-1.0a");
const axios = require("axios");

const CONSUMERKEY =
  "1167302c25e929dc0e3f7bb9506bcb50f09f7e7e6ddd316e166a9f74d940d8a5";
const CONSUMERSECRET =
  "1334c0149cb54d39451c35638512b3d9d4784ba614b4f42fd57dee716ebc8b20";
const TOKENKEY =
  "695c3e49e35740538f4feab6d4427be1d61c6de47f48808ae7e031bead521d48";
const TOKENSECRET =
  "69446859c5dabe6c27e0582fefad2fd011643e7fa37577d07a8d319939f7cc02";
const REALM = "3883026_SB1";

const request = {
  url: "https://3883026-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=372&deploy=1",
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
