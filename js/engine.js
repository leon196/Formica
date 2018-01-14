
let PI2 = Math.PI/2.;

window.onload = function () {

	let sprite = {};
	let painting = {};
	let map = {};
	let buffer = {};
	let rotation = PI2;
	let position = [0,0];
	let rotationSpeed = .01;
	let positionSpeed = 4;
	let frameElapsed = 0;
	let frameBuffer;

	let renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	let textures = {};
	let textureLoader = new THREE.TextureLoader();
	let textureLoaded = 0;
	let textureUrls = [
		{ name:'sprite', url:'image/ant.png' },
		{ name:'painting1', url:'image/image_1534.jpeg' },
	];
	let textureCount = textureUrls.length;
	textureUrls.forEach(item => {
		textureLoader.load(item.url, data => loadedTexture(item.name, data));
	})
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
	shaderUrls.forEach(item => {
		shaderLoader.load(item.url, data => loadedShader(item.name, data));
	})

	function loadedTexture (key, data) {
		textures[key] = data;
		if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
			setup();
		}
	}

	function loadedShader (key, data) {
		shaders[key] = data;
		if (Object.keys(textures).length == textureCount && Object.keys(shaders).length == shaderCount) {
			setup();
		}
	}

	function setup () {
		sprite.material = new THREE.ShaderMaterial( {
			uniforms: {
				uTime: { value: 0 },
				uRotation: { value: rotation },
				uResolution: { value: [window.innerWidth, window.innerHeight] },
				uSprite: { value: textures.sprite },
			},
			vertexShader: shaders['sprite.vert'],
			fragmentShader: shaders['sprite.frag'],
			transparent: true,
		});
		sprite.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), sprite.material );
		scene.add(sprite.mesh);

		map.material = new THREE.ShaderMaterial( {
			uniforms: {
				uTime: { value: 0 },
				uRotation: { value: rotation },
				uPosition: { value: position },
				uResolution: { value: [window.innerWidth, window.innerHeight] },
				uPainting: { value: textures.painting1 },
				uPaintingResolution: { value: [textures.painting1.image.width, textures.painting1.image.height] },
				uBuffer: { value: 0 },
			},
			vertexShader: shaders['map.vert'],
			fragmentShader: shaders['map.frag'],
		});
		map.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), map.material );
		scene.add(map.mesh);

		screen.material = new THREE.ShaderMaterial( {
			uniforms: {
				uTime: { value: 0 },
				uRotation: { value: rotation },
				uPosition: { value: position },
				uResolution: { value: [window.innerWidth, window.innerHeight] },
				uPainting: { value: textures.painting1 },
				uPaintingResolution: { value: [textures.painting1.image.width, textures.painting1.image.height] },
				uBuffer: { value: 0 },
			},
			vertexShader: shaders['screen.vert'],
			fragmentShader: shaders['screen.frag'],
		});
		screen.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), screen.material );
		scene.add(screen.mesh);

		buffer.material = new THREE.ShaderMaterial( {
			uniforms: {
				uTime: { value: 0 },
				uRotation: { value: rotation },
				uPosition: { value: [0.02,0] },
				uResolution: { value: [window.innerWidth, window.innerHeight] },
				uPainting: { value: textures.painting1 },
				uPaintingResolution: { value: [textures.painting1.image.width, textures.painting1.image.height] },
				uBuffer: { value: 0 },
			},
			vertexShader: shaders['buffer.vert'],
			fragmentShader: shaders['buffer.frag'],
		});
		buffer.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), buffer.material );

		frameBuffer = new FrameBuffer({
			width: textures.painting1.image.width,
			height: textures.painting1.image.height,
		});

		camera.position.z = 5;

		document.addEventListener('keydown', Keyboard.onKeyDown);
    document.addEventListener('keyup', Keyboard.onKeyUp);

		requestAnimationFrame( update );
	}

	function update (elapsed) {
		let delta = Math.max(0, Math.min(1, elapsed - frameElapsed));
		if (Keyboard.A.down) {
			rotation -= rotationSpeed * delta;
		} else if (Keyboard.D.down) {
			rotation += rotationSpeed * delta;
		}

		if (Keyboard.W.down) {
			position[0] -= Math.cos(-rotation) * positionSpeed * delta;
			position[1] -= Math.sin(-rotation) * positionSpeed * delta;
		} else if (Keyboard.S.down) {
			position[0] += Math.cos(-rotation) * positionSpeed * delta;
			position[1] += Math.sin(-rotation) * positionSpeed * delta;
		}

		sprite.material.uniforms.uRotation.value = rotation;
		screen.material.uniforms.uRotation.value = rotation;
		screen.material.uniforms.uPosition.value = position;
		buffer.material.uniforms.uPosition.value = position;

		screen.material.uniforms.uBuffer.value = frameBuffer.getTexture();
		map.material.uniforms.uBuffer.value = frameBuffer.getTexture();
		buffer.material.uniforms.uBuffer.value = frameBuffer.getTexture();
		frameBuffer.swap();
		renderer.render(buffer.mesh, camera, frameBuffer.getRenderTarget(), true);

		renderer.render( scene, camera );
		frameElapsed = elapsed;

		requestAnimationFrame( update );
	}

}