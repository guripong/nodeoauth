const express = require('express');
const router = express.Router();

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({model: require('../../lib/oauth2/service-db/model')});

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

router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });


});

router.post('/api',function(req, res, next) {
  console.log('바디:',req.body);
  //토큰이 잘오면 값을 줍시더
  return res.json({isok:'okay'});
});

router.get('/oauth/authorize', async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  const options = {
    authenticateHandler: {
      handle: (data) => {
        // Whatever you need to do to authorize / retrieve your user from post data here
        //여기서 랜더시켜줘서 포스트 해야함...
        //console.log('데이타:',data);
 
        //res.locals.message = err.message;
        //res.locals.error = req.app.get('env') === 'development' ? err : {};
       
        //res.status(200);
          
        /*
        function mytest()
        {
          return new Promise(function(resolve){
            res.render('index', { title: 'Express' });
            resolve(1);
          });  
        }
        console.log('얌마');
        mytest().then(function(results){
          console.log('결과:',results);
          return {idx: '1', userName: 'wedul', scope: 'babo',data:'data'};
        });
        */
       
        return {idx: '1', userName: 'wedul112', scope: 'babo'};
      }
    }
  };
 // console.log('요청:',request);

  try {
    res.json(await oauth.authorize(request, response, options));
  } catch (e) {
      
    console.log('에라:',e);
    next(e);
  }

});

module.exports = router;
