import TorrentService from './TorrentService'
import TorrentRepository from './TorrentRepository'

export default class TorrentController {
  torrentRepository: TorrentRepository;
  torrentService: TorrentService;

  constructor (torrentRepository: TorrentRepository, torrentService: TorrentService) {
    this.torrentRepository = torrentRepository
    this.torrentService = torrentService
  }

  async list (ctx) {
    try {
      const torrents = this.torrentRepository.getAll()
      const stats = await this.torrentService.loadTorrentsStats()

      ctx.body = await torrents.map((item) => {
        item.stats = stats[item.hashString]
        return item
      })
    } catch (ex) {
      ctx.throw(ex)
    }
  }

  async create (ctx) {
    try {
      if (ctx.request.body.link) {
        const created = await this.torrentService.addUrl(ctx.request.body.link)
        ctx.body = await this.torrentRepository.create(ctx.state.user.sub, created.hashString, created.name)
      } else {
        ctx.status = 400
      }
    } catch (ex) {
      if (ex.code === '23505') {
        // Unque constraint violation, return 409 - Conflict
        ctx.status = 409
        ctx.body = { message: 'Torrent already exists' }
      } else {
        ctx.throw(ex)
      }
    }
  }
}
