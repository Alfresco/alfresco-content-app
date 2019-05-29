import { RepoClient } from './utilities/repo-client/repo-client';
import { browser } from 'protractor';

const user1 = browser.params.user1;
console.log('======= user1: ', user1);
const user2 = browser.params.user2;
console.log('======= user2: ', user2);

const adminApis = new RepoClient();

beforeAll(async (done) => {
  try {
    await adminApis.people.createUser({ username: user1 });
    done();
  } catch (error) {
    done.fail(`----- create user1 fail: ${error}`);
  }
  try {
    await adminApis.people.createUser({ username: user2 });
    done();
  } catch (error) {
    done.fail(`----- create user2 fail: ${error}`);
  }
});
