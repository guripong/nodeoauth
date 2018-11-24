const express = require('express');
const router = express.Router();

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({model: require('../../lib/oauth2/service-db/model')});

module.exports = router;

router.post('/oauth/token', async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  try {
    res.json(await oauth.token(request, response));
  } catch (e) {
    console.log(e);
    next(e);
  }

});

router.get('/oauth/authorize', async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  const options = {
    authenticateHandler: {
      handle: (data) => {
        // Whatever you need to do to authorize / retrieve your user from post data here
        return {id: '1', userName: 'wedul'};
      }
    }
  };

  try {
    res.json(await oauth.authorize(request, response, options));
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
