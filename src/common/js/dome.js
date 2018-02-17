export function getData(el, name, value) {
	const prefix = 'data-'
	name = prefix + name
	if (value) {
		return el.setAttribute(name, value)
	} else {
		return el.getAttribute(name)
	}
}

// 浏览器能力检测
let elementStyle = document.createElement('div').style
let vendor = (() => {
	let transformNames = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform',
		standard: 'transform'
	}
	for (let key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key
		}
	}
	return false
})()

export function prefixStyle(style) {
	if (vendor === false) {
		return false
	}
	if (vendor === 'standard') {
		return style
	}
	return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}