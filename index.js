window.addEventListener('DOMContentLoaded', init);

function init() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var angleOfView = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var nearClip = 0.1;
    var farClip = 1000;
    var camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearClip, farClip);
    camera.position.set(0, 0, 1000);


    var scene = new THREE.Scene();

    var width = 500;
    var height = 500;
    var depth = 500;
    var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
    var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0080ff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    var light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(1, 1, 1);

    renderer.render(scene, camera);
}