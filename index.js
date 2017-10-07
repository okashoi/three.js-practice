window.addEventListener('DOMContentLoaded', init);

function init() {
    var screenWidth = 800;
    var screenHeight = 600;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(screenWidth, screenHeight);
    document.body.appendChild(renderer.domElement);

    var angleOfView = 45;
    var aspectRatio = screenWidth / screenHeight;
    var nearClip = 1;
    var farClip = 10000;
    var camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearClip, farClip);
    camera.position.set(0, 0, 1000);


    var scene = new THREE.Scene();

    var cubeWidth = 500;
    var cubeHeight = 500;
    var cubeDepth = 500;
    var cubeGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
    var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0080ff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    var light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(1, 1, 1);


    tick();

    function tick() {
        requestAnimationFrame(tick);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}