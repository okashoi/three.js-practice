window.addEventListener('DOMContentLoaded', init);
window.addEventListener('mousemove', onWindowMousemove);
window.addEventListener('mousedown', onWindowMousedown);

var renderer, scene, camera, light, mouse, raycaster;
var meshes = {};
var states = {theta: 0};

var Core = function (color, radius) {
    this.material = new THREE.MeshLambertMaterial({color: color});
    this.geometry = new THREE.SphereGeometry(radius, 64, 64);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
};

var Satellite = function (color, radius, orbitalRadius, offsetTheta, axisTheta) {
    this.material = new THREE.MeshLambertMaterial({color: color});
    this.geometry = new THREE.SphereGeometry(radius, 64, 64);
    this.orbitalRadius = orbitalRadius;
    this.axisTheta = axisTheta;
    this.offsetTheta = offsetTheta;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
};

Satellite.prototype.updatePosition = function () {
    this.mesh.position.x = this.orbitalRadius * Math.cos(this.axisTheta) * Math.cos(states.theta + this.offsetTheta);
    this.mesh.position.y = this.orbitalRadius * Math.sin(this.axisTheta) * Math.cos(states.theta + this.offsetTheta);
    this.mesh.position.z = this.orbitalRadius * Math.sin(states.theta + this.offsetTheta);
};

function init() {
    //--------------------------
    // animation configurations
    //--------------------------
    // screen
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    // camera
    var angleOfView = 75;
    var cameraPositionOffsetZ = 100;
    var nearClip = 20;

    // objects
    // core
    var coreRadius = 50;
    // satellites
    var radius = 5;
    var orbitalRadius = 120;
    var numberOfSatellites = 13;
    var angularVelocity = Math.PI / 120;

    //-------
    // setup
    //-------
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(screenWidth, screenHeight);
    renderer.setClearColor(0xffffff, 1.0);
    document.getElementsByClassName('render-area')[0].appendChild(renderer.domElement);
    // scene
    scene = new THREE.Scene();
    // camera
    var aspectRatio = screenWidth / screenHeight;
    var cameraPositionZ = orbitalRadius + cameraPositionOffsetZ;
    var farClip = 2 * orbitalRadius + cameraPositionOffsetZ - nearClip;
    camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearClip, farClip);
    camera.position.set(0, 0, cameraPositionZ);
    // light
    light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(0, 0, 200);
    // mouse
    mouse = new THREE.Vector2();
    // raycaster
    raycaster = new THREE.Raycaster();

    //----------------
    // put 3D objects
    //----------------
    meshes.core = new Core(0xcccccc, coreRadius);
    scene.add(meshes.core.mesh);
    light.target = meshes.core.mesh;

    meshes.satellites = [];
    for (var i = 0; i < numberOfSatellites; i++) {
        var satellite = new Satellite(
            0xcccccc,
            radius,
            orbitalRadius,
            4 * Math.PI / numberOfSatellites * (numberOfSatellites - i),
            2 * Math.PI / numberOfSatellites * i
        );
        meshes.satellites.push(satellite);
        scene.add(satellite.mesh);
    }

    draw();
    function draw() {
        requestAnimationFrame(draw);

        // update global states
        states.theta = (states.theta + angularVelocity) % (2 * Math.PI);

        // update 3D objects states
        meshes.satellites.map(function (satellite) {
            satellite.updatePosition();
        });

        // re-render
        renderer.render(scene, camera);
    }
}

function onWindowMousemove(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
}

function onWindowMousedown(event) {
    if (event.target != renderer.domElement) {
        return true;
    }

    raycaster.setFromCamera(mouse, camera);

    if (raycaster.intersectObjects(scene.children).length > 0) {
        alert('clicked');
    }
}