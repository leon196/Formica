
window.onload = function () {

	let ant = {};
	let painting = {};
	let rotation, position;
	let rotationSpeed = .01;
	let positionSpeed = .1;

	let renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	let textureLoader = new THREE.TextureLoader();
	let textures = {};
	textures['ant'] = textureLoader.load('image/ant.png');
	textures['painting1'] = textureLoader.load('image/image_1534.jpeg');
	let files = {};
	let fileLoader = new THREE.FileLoader();
	let fileLoaded = 0;
	let fileUrls = [
		{ name:'painting.frag', url:'shaders/painting.frag' },
		{ name:'painting.vert', url:'shaders/painting.vert' },
	];
	let fileCount = fileUrls.length;
	fileUrls.forEach(item => {
		fileLoader.load(item.url, data => loaded(item.name, data));
	})

	function loaded (key, data) {
		files[key] = data;
		if (Object.keys(files).length == fileCount) {
			setup();
		}
	}

	function setup () {
		// ant.material = new THREE.ShaderMaterial( {
		// 	uniforms: {
		// 		uPainting: 0
		// 	},
		// 	vertexShader: 
		// });
		// ant.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), ant.material );
		painting.material = new THREE.ShaderMaterial( {
			uniforms: {
				uTime: 0,
				uPainting: { value: textures.painting1 },
			},
			vertexShader: files['painting.vert'],
			fragmentShader: files['painting.frag'],
		});
		painting.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), painting.material );
		// scene.add(ant.mesh);
		scene.add(painting.mesh);

		camera.position.z = 5;

		document.addEventListener('keydown', Keyboard.onKeyDown);
    document.addEventListener('keyup', Keyboard.onKeyUp);

    update();
	}

	function update (delta) {
		if (Keyboard.A.down) {
			rotation -= rotationSpeed * delta;
		} else if (Keyboard.D.down) {
			rotation += rotationSpeed * delta;
		}

		if (Keyboard.W.down) {
			position.x -= Math.cos(rotation) * positionSpeed * delta;
			position.y -= Math.sin(rotation) * positionSpeed * delta;
		} else if (Keyboard.S.down) {
			position.x += Math.cos(rotation) * positionSpeed * delta;
			position.y += Math.sin(rotation) * positionSpeed * delta;
		}

		requestAnimationFrame( update );
		renderer.render( scene, camera );
	}

}