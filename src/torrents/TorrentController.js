import TorrentService from './TorrentService';
import TorrentRepository from './TorrentRepository';

export default class TorrentController {
  torrentRepository: TorrentRepository;
  torrentService: TorrentService;

  constructor(torrentRepository: TorrentRepository, torrentService: TorrentService) {
    this.torrentRepository = torrentRepository;
    this.torrentService = torrentService;
  }

  async list(ctx) {
    try {
      const torrents = this.torrentRepository.getAll();
      const stats = await this.torrentService.loadTorrentsStats();

      ctx.body = await torrents.map((item) => {
        item.stats = stats[item.hashString];
        return item;
      });
    } catch (ex) {
      ctx.throw(ex);
    }
  }

  async create(ctx) {
    try {
      const created = await this.torrentService.addUrl('magnet:?xt=urn:btih:ea87df1137ae4a0551d20cd5492ac8d0f0e40bc2&dn=Air.2015.MULTi.1080p.BluRay.x264.DTS.HDMA.-FuReT.mkv&tr=http%3A%2F%2Fhd-only.org%3A2710%2Fiqzqkaf7l5drr5ql4q2qdq9jsi3x5wix%2Fannounce');
      const inserted = await this.torrentRepository.create(1, created.hashString, created.name);

      ctx.body = inserted;
    } catch (ex) {
      if (ex.code === '23505') {
        // Unque constraint violation, return 409 - Conflict
        ctx.status = 409;
        ctx.body = { message: 'Torrent already exists' };
      } else {
        ctx.throw(ex);
      }
    }
  }
}
