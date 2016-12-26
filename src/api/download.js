import Promise from 'bluebird'

import Boom from 'boom'
import Joi from 'joi'
import path from 'path'
import archiver from 'archiver'

import { torrentService } from '../torrents/TorrentService'

const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const fs = Promise.promisifyAll(require('fs'))

export const download = {
  method: 'GET',
  path: '/download/{token}',
  config: {
    auth: false,
    validate: {
      params: {
        token: Joi.string().required()
      }
    }
  },
  handler: async (request, reply) => {
    try {
      const decoded = await jwt.verify(request.params.token, 'secret')

      try {
        const { hashString, filePath } = decoded
        const torrentStats = await torrentService.loadTorrentStats(hashString)

        if (!torrentStats) {
          throw Boom.notFound()
        }

        const fullPath = path.join(torrentStats.downloadDir, filePath)
        const fileStat = await fs.statAsync(fullPath)

        if (fileStat.isFile()) {
          return reply.file(fullPath, { mode: 'attachment', etagMethod: false })
        } else {
          const archive = archiver('zip', { store: true })

          archive.on('error', (err) => { throw err })

          archive.directory(fullPath, '/')
          archive.finalize()

          return reply(archive)
            .header('content-disposition', `attachment; filename=${encodeURIComponent(torrentStats.name)}.zip`)
        }
      } catch (ex) {
        reply(ex)
      }
    } catch (ex) {
      reply(Boom.unauthorized())
    }
  }
}

export default download
