window.addEventListener('DOMContentLoaded', init);

var renderer, scene, camera;
var states = {theta: 0};

var Particle = function (orbitalRadius, offsetY, offsetTheta) {
    this.material = new THREE.MeshLambertMaterial({color: 0x888888});
    this.geometry = new THREE.SphereGeometry(1, 1, 1);
    this.orbitalRadius = orbitalRadius;
    this.offsetTheta = offsetTheta;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = offsetY;
};

Particle.prototype.updatePosition = function () {
    var theta = states.theta + this.offsetTheta;
    this.mesh.position.x = this.orbitalRadius * Math.cos(theta);
    this.mesh.position.z = this.orbitalRadius * Math.sin(theta);
};

var Ring = function (radius, particlesCount, offsetY, offsetTheta) {
    this.particles = [];
    for (var i = 0; i < particlesCount; i++) {
        var theta = 2 * Math.PI / particlesCount * i + offsetTheta;
        this.particles.push(new Particle(radius, offsetY, theta));
    }
};

Ring.prototype.update = function () {
    this.particles.map(function (particle) {
        particle.updatePosition();
    });
};

var Tower = function (radius, floorsCount, ringParticlesCount, floorYDistance, floorThetaDistance) {
    this.rings = [];
    var height = floorYDistance * (floorsCount - 1);
    for (var i = 0; i < floorsCount; i++) {
        var y = floorYDistance * i - height / 2;
        var theta = floorThetaDistance * i;
        this.rings.push(new Ring(radius, ringParticlesCount, y, theta));
    }
};

Tower.prototype.update = function () {
    this.rings.map(function (ring) {
        ring.update();
    });
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
    var nearClip = 100;
    var farClip = 210;

    // objects
    // tower
    var radius = 300;
    var floorsCount = 30;
    var ringParticlesCount = 20;
    var floorYDistance = 10;
    var floorThetaDistance = Math.PI / 7;

    var angularVelocity = Math.PI / 1080;

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
    camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearClip, farClip);
    camera.position.set(0, 0, -100);


    //----------------
    // put 3D objects
    //----------------
    var tower = new Tower(radius, floorsCount, ringParticlesCount, floorYDistance, floorThetaDistance);
    tower.rings.map(function (ring) {
        ring.particles.map(function (particle) {
            scene.add(particle.mesh);
        });
    });

    draw();
    function draw() {
        requestAnimationFrame(draw);

        // update global states
        states.theta = (states.theta + angularVelocity) % (2 * Math.PI);

        // update 3D objects states
        tower.update();

        // re-render
        renderer.render(scene, camera);
    }
}