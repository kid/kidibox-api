import TorrentController from './TorrentController';
import TorrentService from './TorrentService';
import TorrentRepository from './TorrentRepository';

export function register(router) {
  const service = new TorrentService();
  const repository = new TorrentRepository();
  const controller = new TorrentController(service, repository);

  /* eslint-disable func-names */
  router.get('/torrents', async function() { await controller.list(this); });
  router.post('/torrents', async function() { await controller.create(this); });
  /* eslint-enable func-names */
}
