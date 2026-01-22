'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Vector2,
  Color,
  Points,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  AdditiveBlending,
  TextureLoader,
  MathUtils
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import chroma from 'chroma-js';

export function Background_() {
  useEffect(() => {
    function App() {
      const conf = {
        el: 'canvas',
        fov: 75,
        cameraZ: 400,
        background: 0x00001a,
        numPoints: 50000
      };

      let renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera,
        cameraCtrl: OrbitControls,
        startTime: number;
      let width: number, height: number;
      let points: Points;

      const mouse = new Vector2(0.2, 0.2);
      const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;

      init();

      function init() {
        const canvas = document.getElementById(conf.el) as HTMLCanvasElement;
        renderer = new WebGLRenderer({ canvas });
        camera = new PerspectiveCamera(conf.fov);
        camera.far = 10000;
        camera.position.z = conf.cameraZ;
        cameraCtrl = new OrbitControls(camera, renderer.domElement);
        //@ts-ignore
        cameraCtrl.enableKeys = false;
        cameraCtrl.enableDamping = true;
        cameraCtrl.dampingFactor = 0.1;
        cameraCtrl.rotateSpeed = 0.1;

        updateSize();
        window.addEventListener('resize', updateSize);
        renderer.domElement.addEventListener('mousemove', e => {
          mouse.x = (e.clientX / width) * 2 - 1;
          mouse.y = -(e.clientY / height) * 2 + 1;
        });

        startTime = Date.now();
        initScene();
        animate();
      }

      function initScene() {
        scene = new Scene();
        if (conf.background) scene.background = new Color(conf.background);

        const cscale = chroma.scale([0x00b9e0, 0xff880a, 0x5f1b90, 0x7ec08d]);
        const positions = new Float32Array(conf.numPoints * 3);
        const colors = new Float32Array(conf.numPoints * 3);
        const sizes = new Float32Array(conf.numPoints);
        const rotations = new Float32Array(conf.numPoints);
        const sCoef = new Float32Array(conf.numPoints);
        let color: chroma.Color;

        for (let i = 0; i < conf.numPoints; i++) {
          const x = rndFS(1000);
          const y = rndFS(1000);
          const z = rndFS(2000);
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          color = chroma(cscale(rnd(0, 1)).hex());
          colors[i * 3] = color.rgb()[0] / 255;
          colors[i * 3 + 1] = color.rgb()[1] / 255;
          colors[i * 3 + 2] = color.rgb()[2] / 255;

          sizes[i] = rnd(5, 100);
          rotations[i] = rnd(0, Math.PI);
          sCoef[i] = rnd(0.0005, 0.005);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(positions, 3));
        geometry.setAttribute('color', new BufferAttribute(colors, 3));
        geometry.setAttribute('size', new BufferAttribute(sizes, 1));
        geometry.setAttribute('rotation', new BufferAttribute(rotations, 1));
        geometry.setAttribute('sCoef', new BufferAttribute(sCoef, 1));

        const material = new ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: mouse },
            uTexture: { value: new TextureLoader().load('/assets/star.png') }
          },
          vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            attribute vec3 color;
            attribute float size;
            attribute float rotation;
            attribute float sCoef;
            varying vec4 vColor;
            varying float vRotation;
            void main() {
              vColor = vec4(color, 1.);
              vRotation = rotation;
              vec3 p = vec3(position);
              p.z = -1000. + mod(position.z + uTime*(sCoef*50.*uMouse.y), 2000.);
              p.x = -500. + mod(position.x - uTime*(sCoef*50.*uMouse.x), 1000.);
              vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
              gl_Position = projectionMatrix * mvPosition;
              float psize = size * (200. / -mvPosition.z);
              gl_PointSize = psize * (1. + .5*sin(uTime*sCoef + position.x));
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            varying vec4 vColor;
            varying float vRotation;
            void main() {
              vec2 v = gl_PointCoord - .5;
              float ca = cos(vRotation), sa = sin(vRotation);
              mat2 rmat = mat2(ca, -sa, sa, ca);
              gl_FragColor = vColor * texture2D(uTexture, v*rmat + .5);
            }
          `,
          blending: AdditiveBlending,
          depthTest: false,
          transparent: true
        });

        points = new Points(geometry, material);
        scene.add(points);

        renderer.domElement.addEventListener('mouseup', () => randomColors());
      }

      function randomColors() {
        startTime = Date.now();
        const cscale = chroma.scale([
          chroma.random(),
          chroma.random(),
          chroma.random(),
          chroma.random()
        ]);
        const colors = points.geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < conf.numPoints; i++) {
          const j = i * 3;
          const color = cscale(rnd(0, 1)).rgb();
          colors[j] = color[0] / 255;
          colors[j + 1] = color[1] / 255;
          colors[j + 2] = color[2] / 255;
        }
        points.geometry.attributes.color.needsUpdate = true;
      }

      function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() - startTime;
        (points.material as ShaderMaterial).uniforms.uTime.value = time;
        points.rotation.z += -mouse.x * 0.03;
        cameraCtrl.update();
        renderer.render(scene, camera);
      }

      function updateSize() {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }

    App();
  }, []);

  return <canvas id='canvas' className='fixed w-full h-screen z-0'></canvas>;
}

export const Background = dynamic(async () => Background_, { ssr: false });
