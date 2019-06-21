const express = require('express');
const router = express.Router();
var mysql = require('promise-mysql');

var util = require('util');
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
 
  console.log('@@@@/login@@@@');
  console.log('/login 의 param:',req.query);

  res.render('login',
   { 
     title: 'POLY ALEXA Device Login',
     msg: 'Login Please!',
     redirect: req.query.redirect,
     client_id: req.query.client_id,
     redirect_uri: req.query.redirect_uri,
     state:req.query.state,
     response_type:req.query.response_type
    });
});


router.post('/login',function(req,res,next){
  var sess = req.session;
  console.log('총바디:',req.body);

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
      res.render('login', {
        title: 'POLY ALEXA Device Login',
        msg: 'Check your ID or P/W.',
        redirect: req.body.redirect,
        client_id: req.body.client_id,
        redirect_uri: req.body.redirect_uri,
        state: req.body.state,
        response_type:req.body.response_type
      });
    }
    else{
    
//      res.send("합격");
      console.log("DB에서 가져옴성공:"+JSON.stringify(results));
    
      sess.useridx=results.idx;
      sess.username=req.body.user_id;
      var tempaddress = "/oauth/authorize?"+"client_id="+req.body.client_id+"&redirect_uri="+req.body.redirect_uri+"&state="+req.body.state+"&response_type="+req.body.response_type;

      if(results.scope){
        tempaddress = tempaddress+"&scope="+results.scope;
        sess.scope=results.scope;
      }

      console.log("로그인성공..리다이렉트할곳 : "+tempaddress);
      res.redirect(tempaddress);



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
  console.log('@@@@@/oauth/authorize@@@@@@@@@@@@@@');
  console.log('/oauth/authorize의 param:',req.query);
  console.log('세션확인:'+JSON.stringify(sess));

  //@@@@세션말구  req.query.username으로 수정하고
  // 애초에 id,pw 같이 주면 ->로긴확인후 ->토큰

  if(sess.username&&sess.useridx){
    console.log('저장인덱스',sess.useridx);
    console.log('가져온것 /oauth/authorize 성공:',req.query);

    const request = new Request(req);
    const response = new Response(res);
    const options = {
      authenticateHandler: {
        handle: (data) => {
          return {idx: sess.useridx, userName:sess.username, scope:sess.scope};
          //return {idx: '1', userName: 'wedul112', scope: 'babo'};
        }
      }
    };

    try {
      //await oauth.authorize(request, response, options);
      oauth.authorize(request, response, options).then(function(results){
        console.log("코드생성완료"+JSON.stringify(results));
        console.log('태스트오스 코드생성후응답:'+results.redirectUri+'?code='+results.authorizationCode+'&state='+sess.state);
        //res.send('태스트오스 코드생성후응답:'+results.redirectUri+'?code='+results.authorizationCode+'&state='+sess.state);
        res.redirect(results.redirectUri+'?code='+results.authorizationCode+'&state='+sess.state);
       
      });

    } catch (e) {
        
      console.log('에라:',e);
      next(e);
    }
    
  }
  else{
    console.log('야req.query:',req.query);
    sess.clientid =req.query.client_id;
    sess.redirect_uri = req.query.redirect_uri;
    sess.response_type=req.query.response_type;
    sess.state=req.query.state;

    //sess.beforereq = req;
    res.redirect(util.format('/login?redirect=%s&client_id=%s&redirect_uri=%s&state=%s&response_type=%s'
    , req.path, req.query.client_id, req.query.redirect_uri,req.query.state,req.query.response_type));
  }

});




// Post token.



router.post('/oauth/token', async (req, res, next) => {
  var uri = req.url;
  var sess= req.session;
  console.log(uri);
//  새로운세션임
//  console.log('/oauth/token => 세션:');
//  console.log(sess);

  console.log('/oauth/token =>받아온바디:');
  console.log(req.body);
  console.log("@@@@@@@@@@@@@@/oauth/token  post함@@@@@");
  const request = new Request(req);
  const response = new Response(res);
  await oauth.token(request,response).then(function(results){

    console.log(results);
  
    console.log("@@@@@@@@@@@");

    return res.send(results);
  });
  /*
  return oauth.token(request, response).then(function(results){
    console.log("야 여기 동작하는지봐라");
    console.log("@@@@@@@@@@@");
    var cache = [];
    var ppp=JSON.stringify(res.locals, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    res.locals ={tokenType:"iloveyou"};
   // console.log("@:"+ppp);
//    res.locals.oauth = {tokenType: "iloveyou"};
//      res.locals.user = req.session.user;
//      res.locals ={tokenType:"iloveyou"};
    console.log("@@@@@@@@@@@");
    res.json(results);
  });
  */

  /*
  try{
    oauth.token(request, response).then(function(results){
      console.log("야 여기 동작하는지봐라");
      console.log("@@@@@@@@@@@");
      var cache = [];
      var ppp=JSON.stringify(res.locals, function(key, value) {
          if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                  // Duplicate reference found, discard key
                  return;
              }
              // Store value in our collection
              cache.push(value);
          }
          return value;
      });
      cache = null; // Enable garbage collection
      res.locals ={tokenType:"iloveyou"};
     // console.log("@:"+ppp);
  //    res.locals.oauth = {tokenType: "iloveyou"};
//      res.locals.user = req.session.user;
//      res.locals ={tokenType:"iloveyou"};
      console.log("@@@@@@@@@@@");
      
      res.redirect("");
      
      //res.json(results);
    })

   // res.json(await oauth.token(request, response));

 

  } catch (e) {
    console.log(e);
    next(e);
  }
  */

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