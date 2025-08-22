const serverList = [
  {
    name: '线上地址',
    domain: 'http://192.168.1.189:7800',
  },
  {
    name: '本地地址',
    domain: 'http://192.168.1.202:8002/api',
  },
]

module.exports = {
  activeServer: serverList[0],
  serverList: serverList
}
