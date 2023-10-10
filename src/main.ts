import { bootstrap } from '@src/app';

bootstrap()
  .then((): void => {
    console.log(`$$ Process Start!!!`);
  })
  .catch((error: unknown): void => {
    console.log(`$$ Process Start Error!!! ${error}`);
  });
