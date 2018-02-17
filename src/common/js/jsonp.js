import JSONP from 'jsonp'

export default function jsonp(url, data, option) {
	return new Promise((resolve, reject) => {
		url += (url.indexOf('?') === -1 ? '?' : '&') + param(data)
		// jsonp API jsonp(url, opts, fn)
		console.log(url)
		JSONP(url, option, (err, data) => {
			if (!err) {
				resolve(data)
			} else {
				reject(data)
			}
		})
	})
}

function param(data) {
	let url = ''
	for (let k in data) {
		let value = data[k] !== undefined ? data[k] : ''
		url += `&${k}=${encodeURIComponent(value)}`
	}
	return url ? url.substring(1) : ''
}