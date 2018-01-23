var THREE = require('three');
import {TweenMax, Power2} from "gsap";

window.addEventListener('DOMContentLoaded', init);

var renderer, scene, camera;
var states = {
    theta: 0,
    scrollTop: 0,
    transforming: false,
    progress: 0.0
};

// watching scroll amount with interval
var rootDocumentElement = document.documentElement;

var intervalId = setInterval(function () {
    states.scrollTop = rootDocumentElement.scrollTop;
    if (!states.transforming && states.scrollTop > 500) {
        TweenMax.to(
            states,
            2,
            {
                progress: 1.0,
                ease: Power2.easeInOut,
                onStart: function () {states.transforming = true;},
                onComplete: function () {states.transforming = false;}
            }
        );
    }

    if (!states.transforming && states.scrollTop < 500) {
        TweenMax.to(
            states,
            2,
            {
                progress: 0.0,
                ease: Power2.easeInOut,
                onStart: function () {states.transforming = true;},
                onComplete: function () {states.transforming = false;}
            }
        );
    }
}, 300);

var Particle = function (orbitalRadius, offsetY, offsetTheta, transformedPosition) {
    this.material = new THREE.MeshLambertMaterial({color: 0x888888, opacity: 1, transparent: true});
    this.geometry = new THREE.SphereGeometry(2, 8, 8);
    this.orbitalRadius = orbitalRadius;
    this.offsetY = offsetY;
    this.offsetTheta = offsetTheta;
    this.transformedPosition = transformedPosition;
    this.originalOpacity = 1;
    this.transformedOpacity = 0;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = offsetY;
};

Particle.prototype.updatePosition = function () {
    var theta = states.theta + this.offsetTheta;
    var x1 = this.orbitalRadius * Math.cos(theta);
    var y1 = this.offsetY;
    var z1 = this.orbitalRadius * Math.sin(theta);
    var x2 = this.transformedPosition.x;
    var y2 = this.transformedPosition.y;
    var z2 = this.transformedPosition.z;

    this.mesh.position.x = x1 * (1 - states.progress) + x2 * states.progress;
    this.mesh.position.y = y1 * (1 - states.progress) + y2 * states.progress;
    this.mesh.position.z = z1 * (1 - states.progress) + z2 * states.progress;
    this.mesh.material.opacity = this.originalOpacity * (1 - states.progress) * (1 - states.progress) + this.transformedOpacity * states.progress * states.progress;
};

var Ring = function (radius, particlesCount, offsetY, offsetTheta) {
    this.particles = [];
    for (var i = 0; i < particlesCount; i++) {
        var theta = 2 * Math.PI / particlesCount * i + offsetTheta;
        var transformedPosition = {x: 0, y: 0, z: -1100};
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
        var r = Math.sqrt(Math.max(radius * radius - y * y, 0));
        var theta = floorThetaDistance * i;
        this.rings.push(new Ring(r, ringParticlesCount, y, theta));
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
    var angleOfView = 45;
    var nearClip = 1;
    var farClip = 1000;

    // objects
    // tower
    var radius = 300;
    var floorsCount = 30;
    var ringParticlesCount = 18;
    var floorYDistance = 10;
    var floorThetaDistance = Math.PI / 7;

    var angularVelocity = - Math.PI / 2160;

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
    camera.position.set(0, 0, -50);


    //----------------
    // put 3D objects
    //----------------
    var tower = new Tower(radius, floorsCount, ringParticlesCount, floorYDistance, floorThetaDistance);
    tower.rings.map(function (ring) {
        ring.particles.map(function (particle) {
            scene.add(particle.mesh);
        });
    });

    tower.rings[12].particles[0].transformedPosition = {x: 0, y: 0, z: -230};
    tower.rings[12].particles[0].transformedOpacity = 1;
    tower.rings[15].particles[6].transformedPosition = {x: 50, y: 0, z: -230};
    tower.rings[15].particles[6].transformedOpacity = 1;
    tower.rings[18].particles[12].transformedPosition = {x: -50, y: 0, z: -230};
    tower.rings[18].particles[12].transformedOpacity = 1;

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