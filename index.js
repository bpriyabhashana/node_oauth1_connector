const express = require("express");
const app = express();
const crypto = require("crypto");
const oauth1a = require("oauth-1.0a");
const axios = require("axios");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

class Oauth1Helper {
  static getAuthHeaderForRequest(request, req) {
    const oauth = oauth1a({
      consumer: { key: req.CONSUMERKEY, secret: req.CONSUMERSECRET },
      signature_method: "HMAC-SHA256",
      realm: req.REALM,
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha256", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const authorization = oauth.authorize(request, {
      key: req.TOKENKEY,
      secret: req.TOKENSECRET,
    });

    return oauth.toHeader(authorization);
  }
}

app.post("/getNetSuiteData", async function (req, res) {
  const request = {
    url: req.body.url,
    method: "GET",
  };

  const authHeader = Oauth1Helper.getAuthHeaderForRequest(request, req.body);

  const response = await axios
    .get(req.body.url, { headers: authHeader })
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
