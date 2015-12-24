import transmission from '../transmission'

export default class TorrentService {
  async loadTorrentsStats () {
    const data = await transmission.getAsync()
    return data.torrents.reduce((acc, item) => {
      acc[item.hashString] = item
      return acc
    }, {})
  }

  addUrl (url: string) {
    return transmission.addUrlAsync(url)
  }
}

export const torrentService = new TorrentService()
