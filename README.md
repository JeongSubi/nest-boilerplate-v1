# NestJS Boilerplate V1(JWT Auth ver.)
: NestJS Boilerplate with passport, localStrategy

## tech stack
: NestJs, Typescript, TypeORM, PostgreSQL, Graphql, Docker


## ERD
[ERD sample 링크](https://files.slack.com/files-pri/T04JRJSDWKU-F05TW2FL8BY/_______________________________2023-09-27_________________11.51.29.png)

## example API
```
[user]

- 회원가입: signUp 
- 회원탈퇴: signOut 
- 로그인: login 
- 내 id 조회: me

[room]

- 방 목록 조회: rooms 
- 방 상세페이지 조회: room 
- 방 즐겨찾기: likeRoom

[reservation]

- 방 예약하기: reservationRoom
```

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

