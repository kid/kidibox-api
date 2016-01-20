import Boom from 'boom'
import Joi from 'joi'
import path from 'path'

import { torrentRepository } from '../torrents/TorrentRepository'
import { torrentService } from '../torrents/TorrentService'

const list = {
  method: 'GET',
  path: '/torrents',
  handler: async (request, reply) => {
    try {
      const torrentsModels = await torrentRepository.getAll()
      const stats = await torrentService.loadTorrentsStats()

      const torrents = torrentsModels.map((item) => {
        item.stats = stats[item.hashString]
        return item
      })

      reply({ torrents })
    } catch (ex) {
      reply(ex)
    }
  }
}

const create = {
  method: 'POST',
  path: '/torrents',
  handler: async (request, reply) => {
    try {
      if (request.payload && request.payload.link) {
        const created = await torrentService.addUrl(request.payload.link)
        const body = await torrentRepository.create(
          request.auth.credentials.sub,
          created.hashString,
          created.name
        )

        reply(body)
      } else {
        reply(Boom.badRequest())
      }
    } catch (ex) {
      if (ex.code === '23505') {
        // Unque constraint violation, return 409 - Conflict
        reply(Boom.conflict('Torrent already exists'))
      } else {
        reply(ex)
      }
    }
  }
}

const download = {
  method: 'GET',
  path: '/torrents/{torrentId}/{fileIndex?}',
  config: {
    validate: {
      params: {
        torrentId: Joi.number().required(),
        fileIndex: Joi.number()
      }
    }
  },
  handler: async (request, reply) => {
    try {
      const fileIndex = request.params.fileIndex || 0

      const torrentModel = await torrentRepository.get(request.params.torrentId)
      const torrentStats = await torrentService.loadTorrentStats(torrentModel.hashString)

      const filePath = path.join(torrentStats.downloadDir, torrentStats.files[fileIndex].name)

      reply.file(filePath, { mode: 'attachment', etagMethod: false })
    } catch (ex) {
      reply(ex)
    }
  }
}

export default [list, create, download]
