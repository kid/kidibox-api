import TorrentController from './TorrentController'
import TorrentService from './TorrentService'
import TorrentRepository from './TorrentRepository'

export function register (router) {
  const repository = new TorrentRepository()
  const service = new TorrentService()
  const controller = new TorrentController(repository, service)

  router.get('/torrents', async function() { await controller.list(this) })
  router.post('/torrents', async function() { await controller.create(this) })
}
