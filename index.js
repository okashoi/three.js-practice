window.addEventListener('DOMContentLoaded', init);

var Core = function () {

};

function init() {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(screenWidth, screenHeight);
    document.body.appendChild(renderer.domElement);

    var angleOfView = 75;
    var aspectRatio = screenWidth / screenHeight;
    var nearClip = 10;
    var farClip = 200;
    var camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearClip, farClip);
    camera.position.set(0, 0, 110);

    var scene = new THREE.Scene();

    var coreSphereRadius = 10;
    var coreSphereGeometry = new THREE.SphereGeometry(coreSphereRadius);
    var coreSphereMaterial = new THREE.MeshLambertMaterial({color: 0xc0c0c0});
    var coreSphere = new THREE.Mesh(coreSphereGeometry, coreSphereMaterial);
    scene.add(coreSphere);

    var satelliteSphereRadius = 1;
    var satelliteSphereGeometry = new THREE.SphereGeometry(satelliteSphereRadius);
    var satelliteSphereMaterial = new THREE.MeshLambertMaterial({color: 0xc0c0c0});
    var satelliteSphere = new THREE.Mesh(satelliteSphereGeometry, satelliteSphereMaterial);
    scene.add(satelliteSphere);
    satelliteSphere.position.x = 15;

    var light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);
    light.position.set(0, 0, 200);
    light.target = coreSphere;

    var theta = 0;

    tick();
    function tick() {
        requestAnimationFrame(tick);

        theta += Math.PI / 90;
        theta = theta % (2 * Math.PI);
        satelliteSphere.position.x = 15 * Math.cos(theta);
        satelliteSphere.position.z = 15 * Math.sin(theta);

        renderer.render(scene, camera);
    }
}