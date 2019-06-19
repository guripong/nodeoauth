const express = require('express');
const router = express.Router();
var mysql = require('promise-mysql');
var url=require('url');

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({
  model: require('../../lib/oauth2/service-db/model'),
  accessTokenLifetime: 8000000,
	allowBearerTokensInQueryString: true
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
 

  res.render('login', { title: '장비로그인',msg: '로긴해주세요' });
});

router.post('/login',function(req,res,next){
  var sess = req.session;
  console.log('아이디',req.body.user_id);
  console.log('패스와드',req.body.user_pwd);
  var sql=`SELECT idx,scope FROM EDUAI.user where user_name="`+req.body.user_id+`" and password="`+req.body.user_pwd+`";`;
  var connection;

  mysql.createConnection(config).then(function (conn) {

    connection = conn;
    return conn.query(sql);
  }).then(function (results) {
    connection.end();    
    results = JSON.parse(JSON.stringify(results));
    results = results[0];
    //console.log(`아아악:`,results);
    
    if(!results)
    {
      res.render('login', { title: '장비로그인',msg: '아디비번틀렸어용' });
    }
    else{
      sess.useridx=results.idx;
      sess.username=req.body.user_id;

      res.redirect('/oauth/authorize?client_id='+sess.clientid+'&redirect_uri='+sess.redirect_uri+'&scope='+sess.scope+'&response_type='+sess.response_type+'&state='+sess.state);
//      sess.clientid =query.client_id;
//      sess.redirect_uri = query.redirect_uri;
//      sess.scope = query.scope;
//      sess.response_type=query.response_type;
//      sess.state=query.state;
    }
 

    

    //res.redirect('/oauth/authorize');

  }.bind(this));


});

router.post('/api',function(req, res, next) {
  console.log('바디:',req.body);
  //토큰이 잘오면 값을 줍시더
  return res.json({isok:'okay'});
});

router.get('/oauth/authorize', async (req, res, next) => {
  var sess = req.session;



  if(sess.username&&sess.useridx){
    console.log('저장인덱스',sess.useridx);
    const request = new Request(req);
    const response = new Response(res);
    const options = {
      authenticateHandler: {
        handle: (data) => {
   
          //res.locals.message = err.message;
          //res.locals.error = req.app.get('env') === 'development' ? err : {};
         
  //        res.status(200);
  //        res.render('index', { title: '' });
          console.log('야바디:',req.body);
  
          //단 이 모든과정은 로그인 통과시에...
          //이대로 저장하게됨 넘겨온거 받아옵시다..
          return {idx: sess.useridx, userName:sess.username, scope:sess.scope};
          //return {idx: '1', userName: 'wedul112', scope: 'babo'};
        }
      }
    };
   // console.log('요청:',request);
    try {
      ///이게 먼저 시작
      //console.log('야!',await oauth.authorize(request, response, options));
      //await oauth.authorize(request, response, options);
      oauth.authorize(request, response, options).then(function(results){
        console.log("코드생성완료"+JSON.stringify(results));

        //console.log('야야 uri 콜백보자:'+sess.redirect_uri);
        console.log('태스트오스 코드생성후응답:'+results.redirectUri+'?code='+results.authorizationCode+'&state='+sess.state);
        res.redirect(results.redirectUri+'?code='+results.authorizationCode+'&state='+sess.state);
        //res.json(results);
      })
//      res.json(await oauth.authorize(request, response, options));
      //res.redirect('/');

    } catch (e) {
        
      console.log('에라:',e);
      next(e);
    }
    
  }
  else{
    var uri = req.url;
    var query = url.parse(uri,true).query;
    console.log(query);
    //console.log('여기바',query.client_id);
    //console.log('여기바',query.redirect_uri);
    //console.log('여기바',query.scope);
    //console.log('여기바',query.response_type);
    //console.log('여기바',query.state);
    sess.clientid =query.client_id;
    sess.redirect_uri = query.redirect_uri;
    sess.scope = query.scope;
    sess.response_type=query.response_type;
    sess.state=query.state;
    //sess.beforereq = req;
    res.redirect('/login');
  }

});

router.post('/oauth/token', async (req, res, next) => {
  var uri = req.url;
  //var query = url.parse(uri,true).query;
  console.log('다음은uri:'+uri);

  const request = new Request(req);
  const response = new Response(res);
  
  try {
    //res.json(await oauth.token(request, response));
    res.json(await oauth.token(request, response));

    /*
    oauth.token(request, response).then(function(results){
      console.log("토큰생성완료"+JSON.stringify(results));
      return res.json({
      });
    });
    */

  } catch (e) {
    console.log(e);
    next(e);
  }

});

module.exports = router;
var config = {
  host     : 'ls-1385208b74ac4933242088a5f846166785295ccb.cbnpdrzxd040.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'eduaiadmin',
  password : '1a2ijace!!',
  database : 'EDUAI',
  multipleStatements: true,
};