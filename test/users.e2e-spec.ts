import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { AppModule } from '@src/app.module';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

describe('UsersModule (e2e)', (): void => {
  let app: INestApplication;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const falsePrivateTest = (query: string) => baseTest().set('x-jwt', 'xxx').send({ query });

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();

    await app.init();
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
            results {
              user {
                id
              }
            }
          }
        }
        `)
        .expect(200)
        .expect((res: request.Response): void => {
          expect(res.body.data.signUp.ok).toBe(true);
          expect(res.body.data.signUp.results.user.id).toBe(1);
        });
    });
  });

  it('회원가입 실패 - 같은 이메일 유저 존재', () => {
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
          }
        }
        `)
      .expect(200)
      .expect((res): void => {
        expect(res.body.errors[0].message).toBe('There is a user with that email already');
      });
  });

  describe('회원 탈퇴', (): void => {
    it.todo('회원 탈퇴 성공');
    it.todo('회원 탈퇴 실패 - 비밀번호 불일치');
    it.todo('회원 탈퇴 실패 - 유저 토큰 불일치');
  });
});
