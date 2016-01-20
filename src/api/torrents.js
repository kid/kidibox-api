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
      const [torrentsModels, torrentsStats] = await Promise.all([
        torrentRepository.getAll(),
        torrentService.loadTorrentsStats()
      ])

      const torrents = torrentsModels.map((item) => {
        const stats = torrentsStats[item.hashString]
        item.downloadedEver = stats.downloadedEver
        item.uploadedEver = stats.uploadedEver
        item.status = stats.status
        item.totalSize = stats.totalSize
        item.percentDone = stats.percentDone
        item.rateDownload = stats.rateDownload
        item.rateUpload = stats.rateUpload
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

const get = {
  method: 'GET',
  path: '/torrents/{torrentId}',
  config: {
    validate: {
      params: {
        torrentId: Joi.number().required()
      }
    }
  },
  handler: async (request, reply) => {
    const torrentModel = await torrentRepository.get(request.params.torrentId)
    const torrentStats = await torrentService.loadTorrentStats(torrentModel.hashString)

    console.log(torrentStats)

    torrentModel.downloadedEver = torrentStats.downloadedEver
    torrentModel.uploadedEver = torrentStats.uploadedEver
    torrentModel.status = torrentStats.status
    torrentModel.totalSize = torrentStats.totalSize
    torrentModel.bytesCompleted = torrentStats.bytesCompleted
    torrentModel.percentDone = torrentStats.percentDone
    torrentModel.rateDownload = torrentStats.rateDownload
    torrentModel.rateUpload = torrentStats.rateUpload
    torrentModel.files = torrentStats.files

    reply(torrentModel)
  }
}

const download = {
  method: 'GET',
  path: '/torrents/{torrentId}/download/{fileIndex?}',
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

      if (typeof torrentStats[fileIndex] !== 'undefined') {
        const filePath = path.join(torrentStats.downloadDir, torrentStats.files[fileIndex].name)
        reply.file(filePath, { mode: 'attachment', etagMethod: false })
      } else {
        reply(Boom.notFound())
      }
    } catch (ex) {
      reply(ex)
    }
  }
}

export default [list, create, get, download]
