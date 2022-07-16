import * as THREE from "three";
import { extend } from "@react-three/fiber";
import glsl from "babel-plugin-glsl/macro";
import React, { useMemo, useState, useRef } from "react";
import { Canvas, createPortal, useFrame } from "@react-three/fiber";
import { useFBO, OrbitControls } from "@react-three/drei";

import { useControls } from "leva";

class DofPointsMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: `uniform sampler2D positions;
      uniform float uTime;
      uniform float uFocus;
      uniform float uFov;
      uniform float uBlur;
      varying float vDistance;
      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = abs(uFocus - -mvPosition.z);
        gl_PointSize = (step(1.0 - (1.0 / uFov), position.x)) * vDistance * uBlur;
      }`,
      fragmentShader: `uniform float uOpacity;
      varying float vDistance;
      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        if (dot(cxy, cxy) > 1.0) discard;
        gl_FragColor = vec4(vec3(1.0), (1.04 - clamp(vDistance * 1.5, 0.0, 1.0)));
      }`,
      uniforms: {
        positions: { value: null },
        uTime: { value: 0 },
        uFocus: { value: 5.1 },
        uFov: { value: 50 },
        uBlur: { value: 30 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
  }
}

extend({ DofPointsMaterial });

function getPoint(v, size, data, offset) {
  v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
  if (v.length() > 1) return getPoint(v, size, data, offset);
  return v.normalize().multiplyScalar(size).toArray(data, offset);
}

function getSphere(count, size, p = new THREE.Vector3()) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) getPoint(p, size, data, i);
  return data;
}

class SimulationMaterial extends THREE.ShaderMaterial {
  constructor() {
    const sphere = getSphere(512 * 512, 128);
    // console.log(sphere);
    super({
      vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
      fragmentShader: glsl`uniform sampler2D positions;
      uniform float uTime;
      uniform float uCurlFreq;
      varying vec2 vUv;
      #pragma glslify: curl = require(glsl-curl-noise2)
      #pragma glslify: noise = require(glsl-noise/classic/3d.glsl)      
      void main() {
        float t = uTime * 0.015;
        vec3 pos = texture2D(positions, vUv).rgb; // basic simulation: displays the particles in place.
        vec3 curlPos = texture2D(positions, vUv).rgb;
        pos = curl(pos * uCurlFreq + t);
        curlPos = curl(curlPos * uCurlFreq + t);
        curlPos += curl(curlPos * uCurlFreq * 2.0) * 0.5;
        curlPos += curl(curlPos * uCurlFreq * 4.0) * 0.25;
        curlPos += curl(curlPos * uCurlFreq * 8.0) * 0.125;
        curlPos += curl(pos * uCurlFreq * 16.0) * 0.0625;
        gl_FragColor = vec4(mix(pos, curlPos, noise(pos + t)), 1.0);
        
      }`,
      uniforms: {
        positions: {
          value: new THREE.DataTexture(
            sphere,
            512,
            512,
            THREE.RGBFormat,
            THREE.FloatType
          ),
        },
        uTime: { value: 0 },
        uCurlFreq: { value: 0.25 },
      },
    });
  }
}

extend({ SimulationMaterial });

export function Particles({
  speed,
  fov,
  aperture,
  focus,
  curl,
  size = 512,
  ...props
}) {
  const simRef = useRef();
  const renderRef = useRef();
  // Set up FBO
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  );
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat,
    type: THREE.FloatType,
  });
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);
  // Update FBO and pointcloud every frame
  useFrame((state) => {
    state.gl.setRenderTarget(target);
    state.gl.clear();
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);
    renderRef.current.uniforms.positions.value = target.texture;
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFocus.value,
      focus,
      0.1
    );
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFov.value,
      fov,
      0.1
    );
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uBlur.value,
      (3.6 - aperture) * 9,
      0.1
    );
    simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(
      simRef.current.uniforms.uCurlFreq.value,
      curl,
      0.1
    );
  });
  return (
    <>
      {/* Simulation goes into a FBO/Off-buffer */}
      {createPortal(
        <mesh>
          <simulationMaterial ref={simRef} />
          <bufferGeometry>
            <bufferAttribute
              attachObject={["attributes", "position"]}
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attachObject={["attributes", "uv"]}
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      {/* The result of which is forwarded into a pointcloud via data-texture */}
      <points {...props}>
        <dofPointsMaterial ref={renderRef} />
        <bufferGeometry>
          <bufferAttribute
            attachObject={["attributes", "position"]}
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
}

const DemoBox = () => {
  return (
    <mesh>
      <boxBufferGeometry />
      <meshPhongMaterial />
    </mesh>
  );
};

const Lighting = () => {
  return (
    <>
      <ambientLight args={[0xff0000]} intensity={0.1} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
    </>
  );
};

const CanvasApp = () => {
  const props = useControls({
    focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
    speed: { value: 0.1, min: 0.1, max: 100, step: 0.1 },
    aperture: { value: 1.8, min: 1, max: 5.6, step: 0.1 },
    fov: { value: 60, min: 0, max: 200 },
    curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 },
  });
  return (
    <Canvas camera={{ fov: 25, position: [0, 0, 6] }}>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.5}
        zoomSpeed={0.1}
      />
      <Particles {...props} />
    </Canvas>
  );
};

export default CanvasApp;
