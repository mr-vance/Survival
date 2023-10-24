const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 5);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Handle mouse click (as in your original code)

// Create a function to add falling rotating cubes
function addFallingRotatingCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(
    (Math.random() - 0.5) * 8, // Random X position within a range
    5, // Starting height above the floor
    (Math.random() - 0.5) * 8 // Random Z position within a range
  );
  scene.add(cube);

  // Animate the cube
  const speed = 0.02;
  const rotationSpeed = 0.03;
  const fall = () => {
    if (cube.position.y > -1) {
      cube.position.y -= speed;
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;
    } else {
      // Remove the cube when it falls below the floor
      scene.remove(cube);
    }
    requestAnimationFrame(fall);
  };
  fall();
}

// Create a loop to add cubes at intervals
function addCubesLoop() {
  addFallingRotatingCube();
  setTimeout(addCubesLoop, 2000); // Add a new cube every 2 seconds
}

// Start adding cubes
addCubesLoop();

// Set the camera position and look at the center of the scene
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);
// Handle mouse click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onClick = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  loseMusic.play();
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;

    scene.remove(selectedObject);
  }
};

window.addEventListener("click", onClick);

// Create a rendering loop
const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();