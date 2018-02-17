var express = require('express')
var config = require('./config/index')
const axios = require('axios')

const app = express()

const apiRouter = express.Router()

apiRouter.get('/getDiscList', function(req, res) {
  /*
    这里相当于代理，起了中间中转的作用。
    前端发送请求到这里，这里在发送请求到qqMusic，
    再把qq返回的数据返回给前端
  */
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouter.get('/getSongUrlData', function(req, res) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouter.get('/lyric', function(req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    let reg = /({[^()]+})/g
    if (typeof ret === 'string') {
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRouter.get('/getSongList', function(req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    let reg = /({[^()]+})/g
    if (typeof ret === 'string') {
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
app.use('/api', apiRouter)
// 设置静态资源路径
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.export = app.listen(port, function(err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port +'\n')
})