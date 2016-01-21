import Promise from 'bluebird'

import Boom from 'boom'
import Joi from 'joi'
import path from 'path'

import { torrentService } from '../torrents/TorrentService'

const jwt = Promise.promisifyAll(require('jsonwebtoken'))

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
        const { hashString, fileIndex } = decoded
        const torrentStats = await torrentService.loadTorrentStats(hashString)

        if (typeof torrentStats[fileIndex] !== 'undefined') {
          const filePath = path.join(torrentStats.downloadDir, torrentStats.files[fileIndex].name)
          reply.file(filePath, { mode: 'attachment', etagMethod: false })
        } else {
          reply(Boom.notFound())
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
