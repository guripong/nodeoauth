Entity


use marketing;

-- access_token 테이블
create table `oauth_tokens` (
 `client_idx` int(10) unsigned not null,
 `user_idx` int(10) unsigned not null,
 `access_token` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `token_expires` datetime not null,
 `refresh_token` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `refresh_token_expires` datetime not null,
 `scope` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 PRIMARY key(client_idx, user_idx)
)
engine = InnoDB default charset = utf8mb4
collate = utf8mb4_general_ci;

-- authorization code 테이블
create table `oauth_authorization_codes` (
 `client_idx` int(10) unsigned not null,
 `user_idx` int(10) unsigned not null,
 `authorization_code` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `expires` timestamp not null,
 `redirect_uri` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `scope` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 PRIMARY key(client_idx, user_idx)
)
engine = InnoDB default charset = utf8mb4
collate = utf8mb4_general_ci;

-- 사용자 테이블
create table `user` (
 `idx` int(10) unsigned not null auto_increment primary key,
 `user_name` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `password` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `scope` char(255) character set utf8mb4 collate utf8mb4_general_ci not null
)
engine = InnoDB default charset = utf8mb4
collate = utf8mb4_general_ci;

-- oauth_client
create table `oauth_clients` (
 `idx` int(10) unsigned not null auto_increment primary key,
 `name` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `client_id` char(80) character set utf8mb4 collate utf8mb4_general_ci not null,
 `client_secret` char(80) character set utf8mb4 collate utf8mb4_general_ci not null,
 `redirect_uris` char(255) character set utf8mb4 collate utf8mb4_general_ci not null,
 `grant_types` char(80) character set utf8mb4 collate utf8mb4_general_ci not null,
 `scope` char(255) character set utf8mb4 collate utf8mb4_general_ci not null
)
engine = InnoDB default charset = utf8mb4
collate = utf8mb4_general_ci;
collate = utf8mb4_general_ci;

insert into user(user_name, password, scope) values ('wedul', 'dbsafer00', 'readonly');
insert into oauth_clients(name, client_id, client_secret, redirect_uris, grant_types, scope) VALUES ('wedulpos', 'application', 'secret', 'https://www.naver.com', 'password,implict,authorization_code,refresh_token', 'readonly');
