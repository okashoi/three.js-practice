window.addEventListener('DOMContentLoaded', init);

var renderer, scene, camera;
var states = {
    theta: 0,
    scrollTop: 0,
    transforming: false,
    transformed: false,
    progress: 0.0
};

// watching scroll amount with interval
var rootDocumentElement = document.documentElement;

var intervalId = setInterval(function () {
    states.scrollTop = rootDocumentElement.scrollTop;
    if (!states.transformed && !states.transforming && states.scrollTop > 500) {
        states.transforming = true;
    }

    if (states.transformed && !states.transforming && states.scrollTop < 500) {
        states.transforming = true;
    }
}, 300);

var Particle = function (orbitalRadius, offsetY, offsetTheta, transformedPosition) {
    this.material = new THREE.MeshLambertMaterial({color: 0x888888});
    this.geometry = new THREE.SphereGeometry(2, 8, 8);
    this.orbitalRadius = orbitalRadius;
    this.offsetTheta = offsetTheta;
    this.transformedPosition = transformedPosition;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = offsetY;
};

Particle.prototype.updatePosition = function () {
    var theta = states.theta + this.offsetTheta;
    var x1 = this.orbitalRadius * Math.cos(theta);
    var z1 = this.orbitalRadius * Math.sin(theta);
    var x2 = this.transformedPosition.x;
    var z2 = this.transformedPosition.z;

    if (states.transforming && !states.transformed) {
        states.progress += 0.00003;

        if (states.progress >= 1.0) {
            states.progress = 1.0;
            states.transforming = false;
            states.transformed = true;
        }
    } else if (states.transforming && states.transformed) {
        states.progress -= 0.00003;

        if (states.progress <= 0.0) {
            states.progress = 0.0;
            states.transforming = false;
            states.transformed = false;
        }
    }

    this.mesh.position.x = x1 * (1 - states.progress) * (1 - states.progress) + x2 * states.progress * states.progress;
    this.mesh.position.z = z1 * (1 - states.progress) * (1 - states.progress) + z2 * states.progress * states.progress;
};

var Ring = function (radius, particlesCount, offsetY, offsetTheta) {
    this.particles = [];
    for (var i = 0; i < particlesCount; i++) {
        var theta = 2 * Math.PI / particlesCount * i + offsetTheta;
        var transformedPosition = {x: (i - (particlesCount - 1) / 2) * 30, y: offsetY, z: -100};
        this.particles.push(new Particle(radius, offsetY, theta, transformedPosition));
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
    var nearClip = 1;
    var farClip = 210;

    // objects
    // tower
    var radius = 300;
    var floorsCount = 30;
    var ringParticlesCount = 18;
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