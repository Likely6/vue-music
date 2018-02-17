import jsonp from '../common/js/jsonp.js'
import {commonParams, options} from './config.js'
import axios from 'axios'

export function getSongUrlData(id) {
	const url = '/api/getSongUrlData'
	const data = Object.assign({}, commonParams, {
		loginUin: 0,
		hostUin: 0,
		notice: 0,
		platform: 'yqq',
		needNewCode: 0,
		uin: 0,
		songmid: id,
		cid: '205361747',
		filename: `C400${id}.m4a`,
		guid: '6230861934'
	})
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

export function getLyric(id) {
	const url = '/api/lyric'
	const data = Object.assign({}, commonParams, {
		pcachetime: +new Date(),
		loginUin: 0,
		hostUin: 0,
		notice: 0,
		platform: 'yqq',
		needNewCode: 0,
		uin: 0,
		songmid: id,
		cid: '205361747',
		guid: '6230861934'
	})
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}