const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();

const player = {
    height: 1.4,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02,
};

const keyboard = {};

init();

function init() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 8, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

    createGround();
    addBlock();
    
    gameLoop();
}

function createGround() {
    const meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
        })
    );

    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;

    scene.add(meshFloor);
}

function addBlock() {
    block = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xfff,
        }),
    );

    block.position.y += 1;

    block.castShadow = true;
    block.receiveShadow = true;

    scene.add(block);
}


function gameLoop() {
    renderer.render(scene, camera);

    block.rotation.y += 0.1;

    if (keyboard[87]) {
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }

    if (keyboard[83]) {
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }

    if (keyboard[65]) {
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }

    if (keyboard[68]) {
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }

    if (keyboard[37]) {
        camera.rotation.y -= player.turnSpeed;
    }

    if (keyboard[39]) {
        camera.rotation.y += player.turnSpeed;
    }


    requestAnimationFrame(gameLoop);
}


document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

function keyDown(e) {
    keyboard[e.keyCode] = true;
}

function keyUp(e) {
    keyboard[e.keyCode] = false;
}
