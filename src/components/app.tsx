"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import "./app.css";

const geisha = "/images/geisha3.webp";
const samurai = "/images/samurai3.webp";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import TextPressure from "@/components/ui/TextPressure";
import { section } from "motion/react-client";

// ====================================================================
// DEFAULT SETTINGS
// ====================================================================

const TRAIL_LENGTH = 16;
const SPLASH_LENGTH = 16;
const MAX_PIXEL_RATIO = 3;

const MAX_RADIUS = 0.2;
const BLOB_COLOR = "#000000";
const BLOB_OPACITY = 0.2;
const TRAIL_SHRINK_SPEED = 0.3;
const TRAIL_DROP_DISTANCE = 0.005;
const VELOCITY_MULTIPLIER = 6;
const SPLASH_SHRINK_SPEED = 0.6;
const SPLASH_VELOCITY_DAMPING = 0.94;
const MOUSE_STIFFNESS = 90;
const MOUSE_DAMPING = 0.15;
const RADIUS_STIFFNESS = 8;

const STAGE_PARALLAX = 3;

const GHOST_CONFIG = {
  idleThreshold: 700,

  introDuration: 3000,
  travelDuration: 12000,
  forcedRadius: 0.1,

  pauseMin: 300,
  pauseMax: 600,

  smoothing: 2,
  introSmoothing: 0.9,

  fadeInDuration: 520,
  fadeOutDuration: 620,
  endHoldDuration: 180,
  radiusLerp: 0.1,

  microJitterX: 0.0012,
  microJitterY: 0.0008,
};

const GHOST_SVG_PATH =
  "M 50 5 C 22 10, 22 16, 50 21 C 78 26, 78 32, 50 37 C 22 42, 22 48, 50 53 C 78 58, 78 64, 50 69 C 22 74, 22 80, 50 85 C 78 90, 78 95, 50 99";

const GEISHA_SCALE = 1;
const GEISHA_OFFSET_X = "0";
const GEISHA_OFFSET_Y = "0px";
const SAMURAI_SCALE = 1.08;
const GEISHA_MOBILE_SCALE = 2;
const GEISHA_MOBILE_OFFSET_X = "0px";
const GEISHA_MOBILE_OFFSET_Y = "220px";
const SAMURAI_OFFSET_X = "0px";
const SAMURAI_OFFSET_Y = "0px";

// ====================================================================

const vertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_radius;
  uniform float u_time;
  uniform float u_imageAspect;
  
  uniform vec3 u_blobColor;
  uniform float u_blobOpacity;
  uniform float u_hoverState;
  
  uniform vec2 u_trailPositions[${TRAIL_LENGTH}];
  uniform float u_trailSizes[${TRAIL_LENGTH}];

  uniform vec2 u_splashPositions[${SPLASH_LENGTH}];
  uniform float u_splashSizes[${SPLASH_LENGTH}];

  varying vec2 v_uv;

  vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zxy, p.yxz + 19.27);
    return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z));
  }

  float simplex_noise(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K2 * 2.0);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    vec3 x0 = d0;
    vec3 x1 = d1;
    vec3 x2 = d2;
    vec3 x3 = d3;
    vec4 h = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(x0, hash33(i) * 2.0 - 1.0),
      dot(x1, hash33(i + i1) * 2.0 - 1.0),
      dot(x2, hash33(i + i2) * 2.0 - 1.0),
      dot(x3, hash33(i + 1.0) * 2.0 - 1.0)
    );
    return 0.5 + 0.5 * 31.0 * dot(n, vec4(1.0));
  }

  void main() {
    vec2 uv = v_uv;
    float screenAspect = u_resolution.x / u_resolution.y;

    vec2 texCoord = uv;
    if (screenAspect > u_imageAspect) {
      float scaleX = u_imageAspect / screenAspect;
      texCoord.x = (uv.x - 0.5) / scaleX + 0.5;
    } else {
      float scaleY = screenAspect / u_imageAspect;
      texCoord.y = (uv.y - 0.5) / scaleY + 0.5;
    }

    vec2 correctedUV = uv;
    correctedUV.x *= screenAspect;
    vec2 correctedMouse = u_mouse;
    correctedMouse.x *= screenAspect;

    float wave1 = simplex_noise(vec3(correctedUV * 2.0, u_time * 0.4));
    float wave2 = simplex_noise(vec3(correctedUV * 2.5 + 42.0, u_time * 0.5));
    float microNoise = simplex_noise(vec3(correctedUV * 8.0 - vec2(0.0, u_time * 1.5), u_time * 0.7));
    
    vec2 warpOffset = vec2(wave1 - 0.5, wave2 - 0.5) * 0.16;
    warpOffset += vec2(microNoise - 0.5) * 0.02;

    vec2 warpedUV = correctedUV + warpOffset;

    float energy = 0.0;
    
    if (u_radius > 0.001) {
      float mainDist = length(warpedUV - correctedMouse);
      if (mainDist < u_radius) {
        float x = mainDist / u_radius;
        energy += (1.0 - x*x) * (1.0 - x*x); 
      }
    }

    for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
      float dropR = u_trailSizes[i];
      if (dropR > 0.001) {
        vec2 tPos = u_trailPositions[i];
        tPos.x *= screenAspect;
        
        float dropDist = length(warpedUV - tPos);
        if (dropDist < dropR) {
          float x = dropDist / dropR;
          energy += (1.0 - x*x) * (1.0 - x*x);
        }
      }
    }

    for (int i = 0; i < ${SPLASH_LENGTH}; i++) {
      float dropR = u_splashSizes[i];
      if (dropR > 0.001) {
        vec2 sPos = u_splashPositions[i];
        sPos.x *= screenAspect;
        
        float dropDist = length(warpedUV - sPos);
        if (dropDist < dropR) {
          float x = dropDist / dropR;
          energy += (1.0 - x*x) * (1.0 - x*x);
        }
      }
    }

    float mask = smoothstep(0.28, 0.32, energy);

    vec4 tex = texture2D(u_texture, texCoord);
    float insideImage = step(0.0, texCoord.x) * step(texCoord.x, 1.0) *
                        step(0.0, texCoord.y) * step(texCoord.y, 1.0);

    float showTexture = u_hoverState * insideImage;
    vec3 finalColor = mix(u_blobColor, tex.rgb, showTexture * tex.a);
    float finalAlpha = mix(u_blobOpacity, 1.0, showTexture * tex.a) * mask;

    finalColor = pow(finalColor, vec3(1.0 / 2.2));

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

type ShaderUniforms = {
  u_texture: { value: THREE.Texture };
  u_mouse: { value: THREE.Vector2 };
  u_resolution: { value: THREE.Vector2 };
  u_radius: { value: number };
  u_time: { value: number };
  u_imageAspect: { value: number };
  u_blobColor: { value: THREE.Color };
  u_blobOpacity: { value: number };
  u_hoverState: { value: number };
  u_trailPositions: { value: THREE.Vector2[] };
  u_trailSizes: { value: number[] };
  u_splashPositions: { value: THREE.Vector2[] };
  u_splashSizes: { value: number[] };
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function App() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const geishaRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const uniformsRef = useRef<ShaderUniforms | null>(null);
  const animationRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const ghostSvgRef = useRef<SVGSVGElement | null>(null);
  const ghostPathRef = useRef<SVGPathElement | null>(null);
  const ghostPathLengthRef = useRef(0);

  const ghostVisualStrengthRef = useRef(0);
  const ghostTargetVisualStrengthRef = useRef(0);
  const ghostEndingRef = useRef(false);
  const ghostEndHoldUntilRef = useRef(0);

  const ghostIsActiveRef = useRef(false);
  const ghostElapsedRef = useRef(0);
  const ghostPauseUntilRef = useRef(0);
  const ghostIntroStartRef = useRef(new THREE.Vector2(0.5, 0.5));
  const ghostPathStartRef = useRef(new THREE.Vector2(0.5, 0.95));
  const ghostTempTargetRef = useRef(new THREE.Vector2());

  const isCoarsePointerRef = useRef(false);
  const targetHoverStateRef = useRef(0);
  const currentHoverStateRef = useRef(0);

  const trailPositionsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(-10, -10)),
  );
  const trailSizesRef = useRef<number[]>(new Array(TRAIL_LENGTH).fill(0));
  const trailIndexRef = useRef(0);
  const lastDropPosRef = useRef(new THREE.Vector2(-10, -10));

  const splashPositionsRef = useRef(
    Array.from({ length: SPLASH_LENGTH }, () => new THREE.Vector2(-10, -10)),
  );
  const splashVelocitiesRef = useRef(
    Array.from({ length: SPLASH_LENGTH }, () => new THREE.Vector2(0, 0)),
  );
  const splashSizesRef = useRef<number[]>(new Array(SPLASH_LENGTH).fill(0));
  const splashIndexRef = useRef(0);

  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
  const smoothVelocityRef = useRef(new THREE.Vector2(0, 0));

  const lastInteractionTimeRef = useRef(Date.now());

  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const visualControlsStyle = {
    "--geisha-scale": GEISHA_SCALE,
    "--geisha-offset-x": GEISHA_OFFSET_X,
    "--geisha-offset-y": GEISHA_OFFSET_Y,
    "--geisha-mobile-scale": GEISHA_MOBILE_SCALE,
    "--geisha-mobile-offset-x": GEISHA_MOBILE_OFFSET_X,
    "--geisha-mobile-offset-y": GEISHA_MOBILE_OFFSET_Y,
    "--samurai-scale": SAMURAI_SCALE,
    "--samurai-offset-x": SAMURAI_OFFSET_X,
    "--samurai-offset-y": SAMURAI_OFFSET_Y,
  } as CSSProperties;

  const startGhostCycle = useCallback(() => {
    if (!ghostPathRef.current || ghostPathLengthRef.current <= 0) return;

    const startPoint = ghostPathRef.current.getPointAtLength(0);
    ghostPathStartRef.current.set(
      clamp01(startPoint.x / 100),
      clamp01(1 - startPoint.y / 100),
    );

    ghostIntroStartRef.current.copy(smoothMouseRef.current);
    ghostElapsedRef.current = 0;
    ghostIsActiveRef.current = true;
    ghostEndingRef.current = false;

    // Arranca casi apagado para que no “salte” visualmente
    ghostVisualStrengthRef.current = 0;
    ghostTargetVisualStrengthRef.current = 1;
    targetHoverStateRef.current = 1;
  }, []);

  const resetGhostState = useCallback(() => {
    ghostIsActiveRef.current = false;
    ghostElapsedRef.current = 0;
    ghostEndingRef.current = false;
    ghostTargetVisualStrengthRef.current = 0;
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const geishaElement = geishaRef.current;
      if (!geishaElement) return;

      const rect = geishaElement.getBoundingClientRect();
      const rawX = (event.clientX - rect.left) / rect.width;
      const rawY = 1 - (event.clientY - rect.top) / rect.height;
      const x = clamp01(rawX);
      const y = clamp01(rawY);

      targetMouseRef.current.set(x, y);
      targetHoverStateRef.current = 1;
      lastInteractionTimeRef.current = Date.now();
      resetGhostState();
    },
    [resetGhostState],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      handlePointerMove(event);
    },
    [handlePointerMove],
  );

  const handlePointerLeave = useCallback(() => {
    targetHoverStateRef.current = 0;
  }, []);

  const handleImageEnter = useCallback(() => {
    targetHoverStateRef.current = 1;
    lastInteractionTimeRef.current = Date.now();
    resetGhostState();
  }, [resetGhostState]);

  const handleImageLeave = useCallback(() => {
    targetHoverStateRef.current = 0;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const syncMode = () => {
      const coarse = mediaQuery.matches;
      isCoarsePointerRef.current = coarse;
      setIsCoarsePointer(coarse);
    };

    syncMode();
    mediaQuery.addEventListener("change", syncMode);

    return () => mediaQuery.removeEventListener("change", syncMode);
  }, []);

  useEffect(() => {
    if (!ghostPathRef.current) return;
    ghostPathLengthRef.current = ghostPathRef.current.getTotalLength();
  }, []);

  useEffect(() => {
    const container = overlayRef.current;
    if (!container) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    const loader = new THREE.TextureLoader();

    loader.load(samurai, (texture: THREE.Texture) => {
      if (disposed) return;

      texture.colorSpace = THREE.SRGBColorSpace;

      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const textureImage = texture.image as { width: number; height: number };

      const uniforms: ShaderUniforms = {
        u_texture: { value: texture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_radius: { value: 0 },
        u_time: { value: 0 },
        u_imageAspect: { value: textureImage.width / textureImage.height },
        u_blobColor: { value: new THREE.Color(BLOB_COLOR) },
        u_blobOpacity: { value: BLOB_OPACITY },
        u_hoverState: { value: 0 },
        u_trailPositions: { value: trailPositionsRef.current },
        u_trailSizes: { value: trailSizesRef.current },
        u_splashPositions: { value: splashPositionsRef.current },
        u_splashSizes: { value: splashSizesRef.current },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      scene.add(new THREE.Mesh(geometry, material));

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
      );
      renderer.setSize(width, height);

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      uniformsRef.current = uniforms;

      // COMIENZAN LAS DOS LÍNEAS DE CORRECCIÓN:
      renderer.compile(scene, camera);
      clockRef.current = new THREE.Clock();
      // TERMINAN LAS LÍNEAS DE CORRECCIÓN

      resizeObserver = new ResizeObserver(() => {
        if (!rendererRef.current || !uniformsRef.current) return;

        const nextWidth = Math.max(container.clientWidth, 1);
        const nextHeight = Math.max(container.clientHeight, 1);

        rendererRef.current.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
        );
        rendererRef.current.setSize(nextWidth, nextHeight, false);
        uniformsRef.current.u_resolution.value.set(nextWidth, nextHeight);
      });

      resizeObserver.observe(container);
      if (geishaRef.current) resizeObserver.observe(geishaRef.current);

      const render = () => {
        if (
          !rendererRef.current ||
          !sceneRef.current ||
          !cameraRef.current ||
          !uniformsRef.current ||
          !clockRef.current
        ) {
          return;
        }

        const delta = Math.min(clockRef.current.getDelta(), 1 / 30);
        const now = Date.now();

        const visualFadeSpeed =
          ghostTargetVisualStrengthRef.current > ghostVisualStrengthRef.current
            ? delta * (1000 / GHOST_CONFIG.fadeInDuration) * 8
            : delta * (1000 / GHOST_CONFIG.fadeOutDuration) * 8;

        ghostVisualStrengthRef.current = THREE.MathUtils.lerp(
          ghostVisualStrengthRef.current,
          ghostTargetVisualStrengthRef.current,
          Math.min(visualFadeSpeed, 1),
        );

        const isIdle =
          now - lastInteractionTimeRef.current > GHOST_CONFIG.idleThreshold;

        if (isIdle) {
          const totalCycleDuration =
            GHOST_CONFIG.introDuration + GHOST_CONFIG.travelDuration;

          if (!ghostIsActiveRef.current && now >= ghostPauseUntilRef.current) {
            startGhostCycle();
          }

          if (
            ghostIsActiveRef.current &&
            ghostPathRef.current &&
            ghostPathLengthRef.current > 0
          ) {
            ghostElapsedRef.current += delta * 1000;

            const elapsed = ghostElapsedRef.current;
            const introDone = elapsed >= GHOST_CONFIG.introDuration;

            if (!introDone) {
              const introProgress = clamp01(
                elapsed / GHOST_CONFIG.introDuration,
              );
              const introEased = easeOutCubic(introProgress);

              ghostTempTargetRef.current
                .copy(ghostIntroStartRef.current)
                .lerp(ghostPathStartRef.current, introEased);

              targetMouseRef.current.lerp(
                ghostTempTargetRef.current,
                GHOST_CONFIG.introSmoothing,
              );

              // durante la entrada, mantenlo muy sutil para que no “tronque”
              const introRadiusTarget =
                GHOST_CONFIG.forcedRadius *
                0.28 *
                introProgress *
                ghostVisualStrengthRef.current;

              uniformsRef.current.u_radius.value = THREE.MathUtils.lerp(
                uniformsRef.current.u_radius.value,
                introRadiusTarget,
                GHOST_CONFIG.radiusLerp * 0.8,
              );
            } else {
              const travelElapsed = elapsed - GHOST_CONFIG.introDuration;
              const travelProgress = clamp01(
                travelElapsed / GHOST_CONFIG.travelDuration,
              );

              // ida y vuelta en el mismo SVG:
              // 0..0.5 = arriba -> abajo
              // 0.5..1 = abajo -> arriba
              const pathProgress =
                travelProgress <= 0.5
                  ? travelProgress * 2
                  : 1 - (travelProgress - 0.5) * 2;

              const pathEased = easeInOutQuart(pathProgress);

              const pathPoint = ghostPathRef.current.getPointAtLength(
                ghostPathLengthRef.current * pathEased,
              );

              let x = clamp01(pathPoint.x / 100);
              let y = clamp01(1 - pathPoint.y / 100);

              x = clamp01(
                x + Math.sin(now * 0.0045) * GHOST_CONFIG.microJitterX,
              );
              y = clamp01(
                y + Math.cos(now * 0.0065) * GHOST_CONFIG.microJitterY,
              );

              ghostTempTargetRef.current.set(x, y);
              targetMouseRef.current.lerp(
                ghostTempTargetRef.current,
                GHOST_CONFIG.smoothing,
              );

              const halfCycleProgress =
                travelProgress <= 0.5
                  ? travelProgress * 2
                  : (travelProgress - 0.5) * 2;

              const progressFadeIn = Math.min(halfCycleProgress * 4, 1);
              const progressFadeOut = Math.min((1 - halfCycleProgress) * 4, 1);
              const pathEnvelope = progressFadeIn * progressFadeOut;

              const ghostRadiusTarget =
                GHOST_CONFIG.forcedRadius *
                pathEnvelope *
                ghostVisualStrengthRef.current;

              uniformsRef.current.u_radius.value = THREE.MathUtils.lerp(
                uniformsRef.current.u_radius.value,
                ghostRadiusTarget,
                GHOST_CONFIG.radiusLerp,
              );
            }

            if (elapsed >= totalCycleDuration) {
              ghostIsActiveRef.current = false;
              ghostEndingRef.current = true;
              ghostTargetVisualStrengthRef.current = 0;
              ghostEndHoldUntilRef.current = now + GHOST_CONFIG.endHoldDuration;

              ghostPauseUntilRef.current =
                now +
                GHOST_CONFIG.endHoldDuration +
                GHOST_CONFIG.pauseMin +
                Math.random() * (GHOST_CONFIG.pauseMax - GHOST_CONFIG.pauseMin);
            }
          }
        } else {
          ghostIsActiveRef.current = false;
        }

        const mouseToTargetX =
          targetMouseRef.current.x - smoothMouseRef.current.x;
        const mouseToTargetY =
          targetMouseRef.current.y - smoothMouseRef.current.y;

        mouseVelocityRef.current.x += mouseToTargetX * MOUSE_STIFFNESS * delta;
        mouseVelocityRef.current.y += mouseToTargetY * MOUSE_STIFFNESS * delta;
        mouseVelocityRef.current.multiplyScalar(
          Math.pow(MOUSE_DAMPING, delta * 60),
        );

        smoothMouseRef.current.x += mouseVelocityRef.current.x * delta * 60;
        smoothMouseRef.current.y += mouseVelocityRef.current.y * delta * 60;

        uniformsRef.current.u_mouse.value.copy(smoothMouseRef.current);

        smoothVelocityRef.current.lerp(mouseVelocityRef.current, 0.2);
        const velocityMagnitude = smoothVelocityRef.current.length();

        const activeMaxRadius = isCoarsePointerRef.current
          ? MAX_RADIUS * 2.0
          : MAX_RADIUS;

        const activeVelMult = isCoarsePointerRef.current
          ? VELOCITY_MULTIPLIER * 2.5
          : VELOCITY_MULTIPLIER;

        const targetRadius = Math.min(
          velocityMagnitude * activeVelMult,
          activeMaxRadius,
        );

        if (!ghostIsActiveRef.current && !ghostEndingRef.current) {
          uniformsRef.current.u_radius.value +=
            (targetRadius - uniformsRef.current.u_radius.value) *
            RADIUS_STIFFNESS *
            delta;
        }

        if (
          smoothMouseRef.current.distanceTo(lastDropPosRef.current) >
          TRAIL_DROP_DISTANCE
        ) {
          const idx = trailIndexRef.current;
          trailPositionsRef.current[idx].copy(smoothMouseRef.current);
          trailSizesRef.current[idx] = uniformsRef.current.u_radius.value;
          trailIndexRef.current = (idx + 1) % TRAIL_LENGTH;
          lastDropPosRef.current.copy(smoothMouseRef.current);
        }

        for (let i = 0; i < TRAIL_LENGTH; i++) {
          if (trailSizesRef.current[i] > 0) {
            trailSizesRef.current[i] = Math.max(
              0,
              trailSizesRef.current[i] - delta * TRAIL_SHRINK_SPEED,
            );
          }
        }

        if (velocityMagnitude > 0.05 && Math.random() > 0.5) {
          const sIdx = splashIndexRef.current;
          splashPositionsRef.current[sIdx].copy(smoothMouseRef.current);

          const angle = Math.random() * Math.PI * 2;
          const force = velocityMagnitude * (0.8 + Math.random() * 1.5);

          splashVelocitiesRef.current[sIdx].set(
            smoothVelocityRef.current.x * 0.2 + Math.cos(angle) * force,
            smoothVelocityRef.current.y * 0.2 + Math.sin(angle) * force,
          );

          splashSizesRef.current[sIdx] = Math.max(
            0.015,
            uniformsRef.current.u_radius.value * (0.15 + Math.random() * 0.3),
          );

          splashIndexRef.current = (sIdx + 1) % SPLASH_LENGTH;
        }

        for (let i = 0; i < SPLASH_LENGTH; i++) {
          if (splashSizesRef.current[i] > 0) {
            splashPositionsRef.current[i].x +=
              splashVelocitiesRef.current[i].x * delta;
            splashPositionsRef.current[i].y +=
              splashVelocitiesRef.current[i].y * delta;

            splashVelocitiesRef.current[i].multiplyScalar(
              Math.pow(SPLASH_VELOCITY_DAMPING, delta * 60),
            );

            splashSizesRef.current[i] = Math.max(
              0,
              splashSizesRef.current[i] - delta * SPLASH_SHRINK_SPEED,
            );
          }
        }

        if (ghostEndingRef.current && now < ghostEndHoldUntilRef.current) {
          targetHoverStateRef.current =
            ghostVisualStrengthRef.current > 0.02 ? 1 : 0;
        } else if (
          ghostEndingRef.current &&
          now >= ghostEndHoldUntilRef.current
        ) {
          ghostEndingRef.current = false;
          targetHoverStateRef.current = 0;
        }

        currentHoverStateRef.current +=
          (targetHoverStateRef.current - currentHoverStateRef.current) *
          delta *
          8;

        uniformsRef.current.u_hoverState.value = currentHoverStateRef.current;
        uniformsRef.current.u_time.value += delta;

        rendererRef.current.render(sceneRef.current, cameraRef.current);

        const host = stageRef.current;
        if (host) {
          const offsetX = smoothMouseRef.current.x - 0.5;
          const offsetY = 0.5 - smoothMouseRef.current.y;

          host.style.setProperty(
            "--stage-shift-x",
            `${(offsetX * STAGE_PARALLAX).toFixed(2)}px`,
          );
          host.style.setProperty(
            "--stage-shift-y",
            `${(offsetY * STAGE_PARALLAX).toFixed(2)}px`,
          );
        }

        animationRef.current = requestAnimationFrame(render);
      };

      render();
    });

    return () => {
      disposed = true;

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      resizeObserver?.disconnect();
      rendererRef.current?.dispose();
    };
  }, [resetGhostState, startGhostCycle]);

  return (
    <section
      ref={rootRef}
      id="center"
      className={isCoarsePointer ? "is-coarse" : ""}
      style={visualControlsStyle}
      onPointerEnter={isCoarsePointer ? undefined : handlePointerEnter}
      onPointerMove={isCoarsePointer ? undefined : handlePointerMove}
      onPointerLeave={isCoarsePointer ? undefined : handlePointerLeave}
    >
      <svg
        ref={ghostSvgRef}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <path ref={ghostPathRef} d={GHOST_SVG_PATH} fill="none" stroke="none" />
      </svg>

      <div
        ref={stageRef}
        className="media-stage"
        onMouseEnter={isCoarsePointer ? undefined : handleImageEnter}
        onMouseLeave={isCoarsePointer ? undefined : handleImageLeave}
      >
        <div ref={geishaRef} className="geisha">
          <img src={geisha} alt="Geisha" className="geisha-image" />
          <div
            ref={overlayRef}
            className="samurai-overlay"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="circle" />

      <div className="title-container">
        <div className="h1">
          <div className="line">
            <div className="word-slot">
              {isCoarsePointer ? (
                <span className="mobile-hero-word mobile-hero-word--light">
                  Viaja a
                </span>
              ) : (
                <TextPressure
                  text="Viaja a"
                  fontFamily="Nohemi"
                  fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
                  fontWeight={100}
                  fontStyle="normal"
                  fontSize={190}
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  weightFrom={100}
                  weightTo={400}
                  scaleFrom={1}
                  scaleTo={1}
                  textColor="#000000"
                  strokeColor="#DB2F21"
                  minFontSize={50}
                />
              )}
            </div>
            <div className="word-slot">
              {isCoarsePointer ? (
                <span className="mobile-hero-word mobile-hero-word--light-upright">
                  Japón
                </span>
              ) : (
                <TextPressure
                  text="Japón"
                  fontFamily="Nohemi"
                  fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
                  fontWeight={100}
                  fontStyle="normal"
                  fontSize={190}
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={false}
                  weightFrom={100}
                  weightTo={400}
                  scaleFrom={1}
                  scaleTo={1}
                  textColor="#000000"
                  strokeColor="#DB2F21"
                  minFontSize={50}
                />
              )}
            </div>
          </div>

          <div className="line">
            <div className="word-slot">
              {isCoarsePointer ? (
                <span className="mobile-hero-word mobile-hero-word--bold">
                  desde
                </span>
              ) : (
                <TextPressure
                  text="desde"
                  fontFamily="Nohemi"
                  fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
                  fontWeight={900}
                  fontStyle="normal"
                  fontSize={190}
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={false}
                  weightFrom={600}
                  weightTo={100}
                  scaleFrom={1.09}
                  scaleTo={1}
                  textColor="#000000"
                  strokeColor="#DB2F21"
                  minFontSize={50}
                />
              )}
            </div>
            <div className="word-slot">
              {isCoarsePointer ? (
                <span className="mobile-hero-word mobile-hero-word--bold">
                  México
                </span>
              ) : (
                <TextPressure
                  text="México"
                  fontFamily="Nohemi"
                  fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
                  fontWeight={900}
                  fontStyle="normal"
                  fontSize={190}
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={false}
                  weightFrom={600}
                  weightTo={100}
                  scaleFrom={1.09}
                  scaleTo={1}
                  textColor="#000000"
                  strokeColor="#DB2F21"
                  minFontSize={50}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="description">
          <p>Eleva tu vida con una experiencia de viaje con calidad premium.</p>

          <div className="scroll-content">
            <span className="scroll-text">Scroll</span>
            <ArrowDown width={16} />
          </div>
        </div>
        <div className="cta-row">
          <Button variant="primary">Comenzar</Button>
          <Button variant="secondary">Ver destinos</Button>
        </div>
      </div>
    </section>
  );
}
