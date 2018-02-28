const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();

init();

function init() {
    camera.position.z = 5;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createGround();
    
    gameLoop();
}

function createGround() {
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX( Math.PI / 2);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);
}


function gameLoop() {
    renderer.render(scene, camera);

    requestAnimationFrame(gameLoop);
}

/*
document.addEventListener('keydown', move, false);

function move(e) {
    console.log(e.keyCode)
    switch (e.keyCode) {
        // left
        case 37:
            break;
        // right
        case 39:
            break;
        default:
            break;
    }
}*/