window.addEventListener('DOMContentLoaded', init);
window.addEventListener('mousemove', onWindowMousemove);
window.addEventListener('mousedown', onWindowMousedown);

var renderer, scene, camera, mouse, raycaster;
var states = {
    innerTheta: 0,
    outerTheta: 0
};

var InnerBall = function (offsetTheta) {
    this.material = new THREE.MeshLambertMaterial({color: 0xffffff});
    this.geometry = new THREE.SphereGeometry(16, 64, 64);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.offsetTheta = offsetTheta;
};

InnerBall.prototype.update = function () {
    this.mesh.position.x = 30 * Math.cos(states.innerTheta + this.offsetTheta);
    this.mesh.position.z = 30 * Math.sin(states.innerTheta + this.offsetTheta);
};

var OuterBall = function (offsetTheta) {
    this.material = new THREE.MeshLambertMaterial({color: 0xffffff});
    this.geometry = new THREE.SphereGeometry(8, 64, 64);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.offsetTheta = offsetTheta;
};

OuterBall.prototype.update = function () {
    this.mesh.position.x = 70 * Math.cos(states.outerTheta + this.offsetTheta);
    this.mesh.position.z = 70 * Math.sin(states.outerTheta + this.offsetTheta);
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
    var farClip = 5e3;

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
    camera.position.set(0, 20, 100);
    camera.lookAt(new THREE.Vector3(0, -10, 20));

    // lights
    light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(0, -100, 0);
    scene.add(light1);

    var light2 = new THREE.PointLight(0xffffff, 1.3, 1000, 2);
    light2.position.set(0, 100, 100);
    scene.add(light2);

    // mouse
    mouse = new THREE.Vector2();
    // raycaster
    raycaster = new THREE.Raycaster();

    //----------------
    // put 3D objects
    //----------------
    var innerBallsCount = 3;
    var innerBalls = [];
    for (i = 0; i < innerBallsCount; i++) {
        var ball = new InnerBall(i * 2 * Math.PI / innerBallsCount);
        innerBalls.push(ball);
        scene.add(ball.mesh);
    }
    var outerBallsCount = 10;
    var outerBalls = [];
    for (i = 0; i < outerBallsCount; i++) {
        var ball = new OuterBall(i * 2 * Math.PI / outerBallsCount);
        outerBalls.push(ball);
        scene.add(ball.mesh);
    }

    draw();
    function draw() {
        requestAnimationFrame(draw);

        states.innerTheta += Math.PI / 1000;
        states.innerTheta %= 2 * Math.PI;

        states.outerTheta += Math.PI / 600;
        states.outerTheta %= 2 * Math.PI;

        innerBalls.map(function (ball) {
            ball.update();
        });

        outerBalls.map(function (ball) {
            ball.update();
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

    var objects = raycaster.intersectObjects(scene.children);
    if (objects.length > 0) {
        alert('clicked');
    }
}