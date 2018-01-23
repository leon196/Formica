
let paintings = [
	{
		name:'painting1',
		url:'image/17-587799.jpg',
		win: { x: 3093, y: 1158 },
	},{
		name:'painting2',
		url:'image/17-620545.jpg',
		win: { x: 2255, y: 2388 },
	},{
		name:'painting3',
		url:'image/17-620546.jpg',
		win: { x: 2864, y: 2341 },
	},{
		name:'painting4',
		url:'image/95-011771.jpg',
		win: { x: 4091, y: 1330 },
	},{
		name:'painting5',
		url:'image/95-020170.jpg',
		win: { x: 3231, y: 2415 },
	},{
		name:'painting6',
		url:'image/99-005006.jpg',
		win: { x: 4800, y: 900 },
	},
];

let textures = {};
let textureLoader = new THREE.TextureLoader();
let textureLoaded = 0;
let textureUrls = [
	{ name:'sprite', url:'image/ant.png' },
	{ name:'win', url:'image/what.png' },
];
paintings.forEach(item => { textureUrls.push(item); });
let textureCount = textureUrls.length;

let shaders = {};
let shaderLoader = new THREE.FileLoader();
let shaderLoaded = 0;
let shaderUrls = [
	{ name:'buffer.frag', url:'shaders/buffer.frag' },
	{ name:'buffer.vert', url:'shaders/buffer.vert' },
	{ name:'sprite.frag', url:'shaders/sprite.frag' },
	{ name:'sprite.vert', url:'shaders/sprite.vert' },
	{ name:'screen.frag', url:'shaders/screen.frag' },
	{ name:'screen.vert', url:'shaders/screen.vert' },
	{ name:'map.frag', url:'shaders/map.frag' },
	{ name:'map.vert', url:'shaders/map.vert' },
];
let shaderCount = shaderUrls.length;

var callbackOnLoad = null;

function loadedTexture (key, data) {
	textures[key] = data;
	if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
		if (callbackOnLoad != null) {
			callbackOnLoad();
		}
	}
}

function loadedShader (key, data) {
	shaders[key] = data;
	if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
		if (callbackOnLoad != null) {
			callbackOnLoad();
		}
	}
}

function load (callback) {
	callbackOnLoad = callback;
	textureUrls.forEach(item => { textureLoader.load(item.url, data => loadedTexture(item.name, data)); });
	shaderUrls.forEach(item => { shaderLoader.load(item.url, data => loadedShader(item.name, data)); });
}