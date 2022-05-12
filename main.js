import './style.css'

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Clock,
  BufferGeometry,
  BufferAttribute,
  TextureLoader,
  TorusBufferGeometry,
} from "three";

import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

const particlesNumber = 3000;
const particules3D = document.getElementById("particules3D");
const sectionParticules3DHeight = particules3D.clientHeight;
const sectionParticules3DWidth = particules3D.clientWidth;

const scene = new Scene();

const camera = new PerspectiveCamera(
  75,
  sectionParticules3DWidth / sectionParticules3DHeight,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// TextureLoader
const textureLoader = new TextureLoader();
const star = textureLoader.load("./assets/images/star.svg");

// Particules Universe Creation
const particlesGeometry = new BufferGeometry();

const particlesUniverse = new Points(
  particlesGeometry,
  new PointsMaterial({
    size: 0.005,
    alphaMap: star,
    alphaTest: 0.004,
    transparent: true,
    color: "rgb(255,255,255)",
  })
);

// Torus Creation
const torus = new Points(
  new TorusBufferGeometry(0.7, 0.2, 16, 100),
  new PointsMaterial({
    size: 0.005,
    color: "rgb(255,255,255)",
  })
);
//Adding shapes to the scene
scene.add(torus, particlesUniverse);

// Calcul position Particules Universe
//xyz, xyz, xyz...
const positionArray = new Float32Array(particlesNumber * 3);

for (let i = 0; i < particlesNumber * 3; i++) {
  // positionArray[i] = Math.random() - 0.5;
  // positionArray[i] = (Math.random() - 0.5) * 5;
  // positionArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
  positionArray[i] =
    (Math.random() - 0.5) * (Math.random() * 5) * (Math.random() * 5);
}
//positioning particules
particlesGeometry.setAttribute(
  "position",
  new BufferAttribute(positionArray, 3)
);

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});

//renderer
renderer.setSize(sectionParticules3DWidth, sectionParticules3DHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
particules3D.appendChild(renderer.domElement);

//mouse
particules3D.addEventListener("mousemove", animateParticules);
particules3D.addEventListener("mouseleave", reset);

let mouseX = 0;
let mouseY = 0;

function animateParticules(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function reset() {
  mouseX = 0;
  mouseY = 0;
}

//animation & update renderer
const clock = new Clock();

const tick = () => {
  const time = clock.getElapsedTime();

  //Rotation Universe Particules & Torus
  torus.rotation.y = 0.5 * time;

  if (mouseX > 0) {
    particlesUniverse.rotation.x = -mouseY * (time * 0.00008);
    particlesUniverse.rotation.y = -mouseX * (time * 0.00008);
  } else if (mouseX === 0) {
    particlesUniverse.rotation.y = -0.1 * time;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

//resize Refresh
window.addEventListener("resize", () => {
  camera.aspect = particules3D.clientWidth / particules3D.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(particules3D.clientWidth, particules3D.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//GSAP animation
gsap.registerPlugin(CSSRulePlugin);
const content = CSSRulePlugin.getRule(
  "#particules3D .content::before"
);

const h1 = document.querySelector("h1");
const p = document.querySelector("p");

const tl = gsap.timeline();
tl.from(content, { delay: 0.5, duration: 4, cssRule: { scaleX: 0 } });
tl.to(
  h1,
  {
    duration: 2,
    clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0 100%)",
    y: 0,
  },
  "-=3"
).to(
  p,
  {
    duration: 4,
    clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0 100%)",
    y: 0,
  },
  "-=2"
);
