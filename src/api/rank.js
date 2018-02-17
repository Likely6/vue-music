import jsonp from '../common/js/jsonp.js'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getTopList() {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?'
	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
		gt_k: '57157'
	})
	return jsonp(url, data, options)
}

export function getMusicList(topid) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?'
	const data = Object.assign({}, commonParams, {
		topid,
		tpl: 3,
		platform: 'h5',
		page: 'detail',
		type: 'top',
		gt_k: '571578387'
	})
	return jsonp(url, data, options)
}