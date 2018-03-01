const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();

const player = {
    height: 1.4,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02,
};

const keyboard = {};
const objects = [];
const bulletsArr = [];
let availableBullets = 100;

init();

function refreshBulletsCounter() {
    document.getElementById('bullets').innerHTML = availableBullets;
}

function init() {
    refreshBulletsCounter();

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
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
        })
    );

    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;

    scene.add(meshFloor);
}

function addBlock() {
    for (let i=0; i<50; i++) {
        block = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({
                color: 0xfff,
            }),
        );
    
        block.position.x = Math.floor( Math.random() * 20 - 10 ) * 4;
        block.position.z = Math.floor( Math.random() * 20 - 10 ) * 4;
        block.position.y += 1;
    
        block.castShadow = true;
        block.receiveShadow = true;

        scene.add(block);
        objects.push(block);
    }
}

function shoot() {
    if (availableBullets <= 0) {
        return false;
    }   

    var bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.05,8,8),
        new THREE.MeshBasicMaterial({color:0xffffff})
    );

    bullet.position.x = camera.position.x;
    bullet.position.y = 1;
    bullet.position.z = camera.position.z + 1;

    bullet.velocity = new THREE.Vector3(
        -Math.sin(camera.rotation.y),
        0,
        Math.cos(camera.rotation.y)
    );

    bullet.isActive = true;
    bulletsArr.push(bullet);    
    scene.add(bullet);

    setTimeout(() => {
        bullet.isActive = false;
        scene.remove(bullet);
    }, 1000);

    availableBullets--;
    refreshBulletsCounter();
}

function gameLoop() {
    renderer.render(scene, camera);

    for (let i=0; i<bulletsArr.length; i++) {
        if (bulletsArr[i].isActive) {
            bulletsArr[i].position.add(bulletsArr[i].velocity);
        }
    }

    if (keyboard[32]) {
        shoot();
    }

    if (keyboard[82]) {
        availableBullets = 100;
        refreshBulletsCounter();
    }

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
