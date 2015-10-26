import UserController from './UserController';
import UserRepository from './UserRepository';
import UserService from './UserService';

export function register(router) {
  const repository = new UserRepository();
  const service = new UserService();
  const controller = new UserController(repository, service);

  /* eslint-disable func-names */
  router.post('/register', async function() { await controller.register(this); });
  router.post('/authenticate', async function() { await controller.authenticate(this); });
  /* eslint-enable func-names */
}
