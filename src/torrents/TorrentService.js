import transmission from '../transmission'

export default class TorrentService {
  async loadTorrentsStats () {
    const data = await transmission.getAsync()
    return data.torrents.reduce((acc, item) => {
      acc[item.hashString] = item
      return acc
    }, {})
  }

  async loadTorrentStats (hashString: string) {
    const data = await transmission.getAsync(hashString)
    return data.torrents[0]
  }

  addUrl (url: string) {
    return transmission.addUrlAsync(url)
  }

  addFile (path: string) {
    return transmission.addFileAsync(path)
  }
}

export const torrentService = new TorrentService()
