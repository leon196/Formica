
let PI2 = Math.PI/2.;

window.onload = function () {

	let sprite = {};
	let painting = {};
	let map = {};
	let buffer = {};
	let rotation = PI2;
	let position = [0,0];
	let lastPosition = [0,0];
	let rotationSpeed = .01;
	let positionSpeed = 4;
	let frameElapsed = 0;
	let playerWin = false;
	let frameBuffer = new FrameBuffer();

	let paintingScale = 20.;
	let winArea = 200;
	let winDamping = .003;
	let jumpHeight = 10;
	let jumpDamping = .1;
	let distanceTotal = 0;
	let currentPainting = 0;

	let renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
	let uniforms;

	load(setup);

	function setupLevel () {
		distanceTotal = 0;
		position[0] = 0;
		position[1] = 0;
		lastPosition[0] = 0;
		lastPosition[1] = 0;
		uRotation = Math.PI/2.;

		let key = paintings[currentPainting].name;

		paintings[currentPainting].width = textures[key].image.width;
		paintings[currentPainting].height = textures[key].image.height;

		uniforms.uPainting.value = textures[key];
		uniforms.uPaintingResolution.value[0] = paintings[currentPainting].width;
		uniforms.uPaintingResolution.value[1] = paintings[currentPainting].height;
		uniforms.uWinPosition.value[0] = paintings[currentPainting].win.x;
		uniforms.uWinPosition.value[1] = paintings[currentPainting].win.y;

		frameBuffer.setSize(paintings[currentPainting].width/8, paintings[currentPainting].height/8);
	}

	function setup () {

		uniforms = {
			uTime: { value: 0 },
			uRotation: { value: rotation },
			uPosition: { value: [0,0] },
			uWinPosition: { value: [0,0] },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
			uSprite: { value: textures.sprite },
			uWin: { value: textures.win },
			uPainting: { value: 0 },
			uPaintingResolution: { value: [0, 0] },
			uBuffer: { value: 0 },
			uClear: { value: 0 },
			uPlayerWin: { value: 0 },
			uJump: { value: 0 },
			uDistanceTotal: { value: 0 },
			uScale: { value: paintingScale },
		};

		setupLevel();

		sprite.material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shaders['sprite.vert'],
			fragmentShader: shaders['sprite.frag'],
			transparent: true,
		});
		sprite.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), sprite.material );
		scene.add(sprite.mesh);

		map.material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shaders['map.vert'],
			fragmentShader: shaders['map.frag'],
		});
		map.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), map.material );
		scene.add(map.mesh);

		screen.material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shaders['screen.vert'],
			fragmentShader: shaders['screen.frag'],
		});
		screen.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), screen.material );
		scene.add(screen.mesh);

		buffer.material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: shaders['buffer.vert'],
			fragmentShader: shaders['buffer.frag'],
		});
		buffer.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), buffer.material );

		camera.position.z = 5;

		document.addEventListener('keydown', Keyboard.onKeyDown);
    document.addEventListener('keyup', Keyboard.onKeyUp);

		requestAnimationFrame( update );
	}

	function bufferPass () {
		uniforms.uBuffer.value = frameBuffer.getTexture();
		frameBuffer.swap();
		renderer.render(buffer.mesh, camera, frameBuffer.getRenderTarget(), true);
	}

	function update (elapsed) {
		let delta = Math.max(0, Math.min(1, elapsed - frameElapsed));

		uniforms.uTime.value += delta;

		if (playerWin == false) {
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

			distanceTotal += Math.abs(position[0]-lastPosition[0])+Math.abs(position[1]-lastPosition[1]);
			lastPosition[0] = position[0];
			lastPosition[1] = position[1];

			uniforms.uRotation.value = rotation;
			uniforms.uPosition.value = position;
			uniforms.uDistanceTotal.value = distanceTotal;

			if (Keyboard.Space.down) {
				Keyboard.Space.down = false;
				uniforms.uJump.value = lerp(uniforms.uJump.value, jumpHeight, jumpDamping);
				uniforms.uJump.value = Math.max(0, Math.min(1, uniforms.uJump.value));
			} else {
				uniforms.uJump.value = lerp(uniforms.uJump.value, 0, jumpDamping);
			}
		}

		let winPos = paintings[currentPainting].win;
		let key = paintings[currentPainting].name;
		if (Math.abs(position[0] - winPos.x) + Math.abs(position[1] - (paintings[currentPainting].height - winPos.y)) < winArea) {
			playerWin = true;
			uniforms.uPlayerWin.value = lerp(uniforms.uPlayerWin.value, 1, delta * winDamping);
		}

		if (uniforms.uPlayerWin.value >= .99) {
			playerWin = false;
			uniforms.uTime.value = 0;
			uniforms.uPlayerWin.value = 0;
			currentPainting = (currentPainting + 1) % Object.keys(paintings).length;
			uniforms.uClear.value = 1;
			bufferPass();	
			uniforms.uClear.value = 0;
			setupLevel();
		}

		bufferPass();

		renderer.render( scene, camera );
		frameElapsed = elapsed;

		requestAnimationFrame( update );
	}

}