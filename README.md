npm
--------
> oauth2-server


Header값
----
> Authorization Basic 내용은 clientId와 password의 base64값 두개의 값은 Basic + new Buffer(내용).tostring('base64');



grand type별 확인 방법
----
1. password
- 요청 시 진행 사항
    - oauth2-server 기능 사용 시 /oauth/token 시 동작하는 메서드 순서
    - getClient → getUser → saveToken

- 요청 방법
    - curl http://localhost:3001/oauth/token -d "grant_type=password" -d "username=wedul" -d "password=dbsafer00" -H "Authorization: Basic YXBwbGljYXRpb246c2VjcmV0" -H "Content-Type: application/x-www-form-urlencoded"

2. authorization_code
- oauth2-server 기능 사용 시 /oauth/autho 시 동작하는 메서드 순서
    - getClient → saveAuthorizationCode


- code 요청
    - http://localhost:3001/oauth/authorize?response_type=code&client_id=application&redirect_uri=https://www.naver.com&scope=babo&state=1232

- AccessToken 발급 요청
    - curl -X POST 'http://localhost:3001/oauth/token' -H 'Authorization: Basic YXBwbGljYXRpb246c2VjcmV0' -d 'grant_type=authorization_code' -d 'code=77ef15102a0f36271f6f071f6cd02b7219f54a00' -d 'redirect_uri=https://www.naver.com' -d 'scope:babo'


- 주의사항
    - redirect_uri가 클라이언트 정보에 있어야하는 정보
    - state 값이 존재해야함 (랜덤)
    - authorization_code 방식 사용 시 authorize 문제 해결 방법
    - https://github.com/oauthjs/node-oauth2-server/issues/358


- Refresh Token으로 새로운 access_token 발급 요청 인증 방식*
    - curl -X POST 'http://localhost:3001/oauth/token' -H 'Authorization: Basic YXBwbGljYXRpb246c2VjcmV0' -d 'grant_type=refresh_token' -d 'refresh_token=ad7dfc2f73e6616ac0a96ac812be75adcf31a748'




참고
-----
- http://jsonobject.tistory.com/369
- https://github.com/manjeshpv/node-oauth2-server-implementation/blob/master/components/oauth/models.js
- https://github.com/pedroetb/node-oauth2-server-example
- https://sequelize.readthedocs.io/en/v3/api/datatypes/
- https://www.npmjs.com/package/oauth2-server
- https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html#token-request-response-options-callback
- https://github.com/oauthjs/node-oauth2-server/blob/e1f741fdad191ee47e7764b80a8403c1ea2804d4/lib/grant-types/authorization-code-grant-type.js
- https://github.com/manjeshpv/node-oauth2-server-implementation
