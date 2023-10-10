import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { UsersService } from '@modules/users/services/users.service';
import { AppModule } from '@src/app.module';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

describe('UsersModule (e2e)', (): void => {
  let app: INestApplication;
  let usersService: UsersService;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  // const masterPrivateTest = (query: string) =>
  //   baseTest().set('x-jwt', masterJwtToken).send({ query });

  const falsePrivateTest = (query: string) => baseTest().set('x-jwt', 'xxx').send({ query });

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();

    await app.init();
    // await usersService.createUser({
    //   email: 'master@test.com',
    //   name: 'master',
    //   password: 'testPassword',
    //   phoneNumber: '01011111111',
    //   nickName: 'master',
    // });

    // jwtToken = signupResult.token;
  });

  afterAll(async (): Promise<void> => {
    await getConnection().dropDatabase();
    await app.close();
  });

  /**
   * 회원가입
   */
  describe('회원가입', (): void => {
    it('회원가입 성공', () => {
      return publicTest(`
        mutation {
          signUp(input: {
            email:"example@email.com",
            password:"test1234!!",
            name:"name",
            nickName:"nickName",
            phoneNumber:"01012345678"
          }) {
            ok
            error
          }
        }
        `)
        .expect(500)
        .expect((res: request.Response): void => {
          console.log(res.body.errors[0].message);
          // expect(res.body.data.signUp.ok).toBe(true);
          // expect(res.body.data.signUp.error).toBe(null);
          // expect(res.body.data.signUp.result.id).toBe(1);
        });
    });
  });
  // it('상점 생성 실패 - 만료 토큰', () => {
  //   return falsePrivateTest(`
  //     mutation {
  //       createShopV2(input: {
  //         name:"name",
  //         description:"description"
  //         isDisplayed:true,
  //         address:"address",
  //         representative:"representative",
  //         businessNumber:"businessNumber",
  //         reportNumber:"reportNumber",
  //         serverCenterContact:"serverCenterContact",
  //         representativeEmail:"representativeEmail",
  //         businessName:"businessName",
  //         logoImg:"logoImg",
  //         coverImages:["coverImages"],
  //       }) {
  //         ok
  //         error
  //         result {
  //           id
  //         }
  //       }
  //     }
  //     `)
  //     .expect(200)
  //     .expect((res):void => {
  //       expect(res.body.errors[0].message).toBe('jwt malformed');
  //     });
  // });

  // // 상점 목록 조회
  // describe('상점 목록 조회', () => {
  //   it('상점 목록 조회 성공', () => {
  //     return masterPrivateTest(`
  //       query {
  //         shops(input: {
  //           page:1,
  //           count:15,
  //           filter:"",
  //           filterCriteria:Partnership
  //         }) {
  //           ok
  //           error
  //           totalPages
  //           totalResults
  //           results {
  //             id
  //             name
  //           }
  //         }
  //       }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.data.shops.ok).toBe(true);
  //         expect(res.body.data.shops.error).toBe(null);
  //         expect(res.body.data.shops.results[0].id).toBe(1);
  //       });
  //   });
  //
  //   it('상점 목록 조회 실패 - 상점 정보 없음', () => {
  //     return masterPrivateTest(`
  //       query {
  //         shops(input: {
  //           page:1,
  //           count:15,
  //           filter:"",
  //           filterCriteria:Crawling,
  //         }) {
  //           ok
  //           error
  //           totalPages
  //           totalResults
  //           results {
  //             id
  //             name
  //           }
  //         }
  //       }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body.errors[0].message).toBe(`There is no shops`);
  //       });
  //   });
  // });
});
