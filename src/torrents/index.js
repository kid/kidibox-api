import TorrentController from './TorrentController';
import TorrentService from './TorrentService';
import TorrentRepository from './TorrentRepository';

export function register(router, authenticate) {
  const repository = new TorrentRepository();
  const service = new TorrentService();
  const controller = new TorrentController(repository, service);

  /* eslint-disable func-names */
  router.get('/torrents', authenticate, async function() { await controller.list(this); });
  router.post('/torrents', authenticate, async function() { await controller.create(this); });
  /* eslint-enable func-names */
}
