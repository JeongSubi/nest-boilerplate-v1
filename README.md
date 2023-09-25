# NestJS Boilerplate V1(JWT Auth ver.)
: NestJS Boilerplate with passport, localStrategy

## tech stack
```
NestJs, Typescript, typeORM, PostgreSQL, Graphql, Docker
```

## ERD
[ERD 링크]()

## api 구현 기능
[user]
- 회원가입: signUp <br/>
- 회원탈퇴: signOut <br/>
- 로그인: login <br/>
- 내 id 조회: me <br/><br/>

[room]
- 방 목록 조회: rooms <br/>
- 방 상세페이지 조회: room <br/>
- 방 즐겨찾기: likeRoom <br/><br/>

[reservation]
- 방 예약하기: reservationRoom <br/><br/>

## Getting Started

```
USING YARN (Recommend)
1. yarn install
2. docker compose -f ./docker/docker-compose-localhost.yml up -d (localhost environment)
2. yarn start:dev

USING NPM
1. npm i OR npm i --legacy-peer-deps
2. docker compose -f ./docker/docker-compose-localhost.yml up -d (localhost environment)
2. npm start:dev
```

## Author

```
2023.06.21 ~
Author: Subi Jeong
```

