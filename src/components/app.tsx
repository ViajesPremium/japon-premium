"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import TextType from "./ui/TextType";
import "./app.css";
import { Button } from "./ui/button";

const geisha = "/images/geisha.png";
const samurai = "/images/samurai.png";

// ====================================================================
// 🎛️ DEFAULT SETTINGS
// ====================================================================

const TRAIL_LENGTH = 32;
const SPLASH_LENGTH = 16;
const MAX_PIXEL_RATIO = 3;

const MAX_RADIUS = 0.5;
const BLOB_COLOR = "#000000";
const BLOB_OPACITY = 0.3;
const TRAIL_SHRINK_SPEED = 0.3;
const TRAIL_DROP_DISTANCE = 0.005;
const VELOCITY_MULTIPLIER = 6;
const SPLASH_SHRINK_SPEED = 0.6;
const SPLASH_VELOCITY_DAMPING = 0.94;
const MOUSE_STIFFNESS = 60;
const MOUSE_DAMPING = 0.15;
const RADIUS_STIFFNESS = 8;

const STAGE_PARALLAX = 15;

const GHOST_IDLE_THRESHOLD = 1500;
const GHOST_MOVE_DURATION = 1400;
const GHOST_FORCED_RADIUS = 0.12;
const GHOST_PAUSE_MIN = 1200;
const GHOST_PAUSE_MAX = 1500;

const GEISHA_SCALE = 1;
const GEISHA_OFFSET_X = "0";
const GEISHA_OFFSET_Y = "0px";
const SAMURAI_SCALE = 1;

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
  uniform float u_radius;       // Radio actual del cursor principal
  uniform float u_time;
  uniform float u_imageAspect;
  
  uniform vec3 u_blobColor;
  uniform float u_blobOpacity;
  uniform float u_hoverState;
  
  // Memoria física: Cada gota recuerda qué tan grande era al nacer y se encoge
  uniform vec2 u_trailPositions[${TRAIL_LENGTH}];
  uniform float u_trailSizes[${TRAIL_LENGTH}];

  // Salpicaduras independientes que vuelan por inercia
  uniform vec2 u_splashPositions[${SPLASH_LENGTH}];
  uniform float u_splashSizes[${SPLASH_LENGTH}];

  varying vec2 v_uv;

  // Ruido ultra suave solo para darle vibración natural al borde
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

    // Cubrir la pantalla sin deformar
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

    // --- DEFORMACIÓN LÍQUIDA (Pintura orgánica) ---
    // Capa base de ruido (formas asimétricas amplias)
    float wave1 = simplex_noise(vec3(correctedUV * 2.0, u_time * 0.4));
    float wave2 = simplex_noise(vec3(correctedUV * 2.5 + 42.0, u_time * 0.5));
    
    // Ruido secundario para darle un flujo "deslizante" a los bordes
    float microNoise = simplex_noise(vec3(correctedUV * 8.0 - vec2(0.0, u_time * 1.5), u_time * 0.7));
    
    // Vector de distorsión asimétrica
    vec2 warpOffset = vec2(wave1 - 0.5, wave2 - 0.5) * 0.16;
    warpOffset += vec2(microNoise - 0.5) * 0.02;

    vec2 warpedUV = correctedUV + warpOffset;

    // --- ENERGÍA LÍQUIDA (METABALLS) ---
    float energy = 0.0;
    
    // 1. Cursor Principal (Crece al mover, se encoge a 0 al detenerse)
    if (u_radius > 0.001) {
        float mainDist = length(warpedUV - correctedMouse);
        if (mainDist < u_radius) {
            float x = mainDist / u_radius;
            energy += (1.0 - x*x) * (1.0 - x*x); 
        }
    }

    // 2. Gotas del Rastro
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

    // 3. Gotas voladoras (Salpicaduras emitidas por inercia)
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

    // El líquido se corta limpiamente sin opacidades
    float mask = smoothstep(0.28, 0.32, energy);

    // Textura
    vec4 tex = texture2D(u_texture, texCoord);
    float insideImage = step(0.0, texCoord.x) * step(texCoord.x, 1.0) *
                        step(0.0, texCoord.y) * step(texCoord.y, 1.0);

    float showTexture = u_hoverState * insideImage;
    vec3 finalColor = mix(u_blobColor, tex.rgb, showTexture * tex.a);
    
    // Combina la opacidad del líquido con la opacidad de la textura si mostramos la imagen
    float finalAlpha = mix(u_blobOpacity, 1.0, showTexture * tex.a) * mask;
    
    // ==========================================
    // CORRECCIÓN GAMMA (RESTAURACIÓN DE COLOR)
    // ==========================================
    // Evita que la imagen se vea oscura al renderizarse en crudo.
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

function App() {
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

  const isCoarsePointerRef = useRef(false);
  const targetHoverStateRef = useRef(0);
  const currentHoverStateRef = useRef(0);

  // Arreglos de memoria física
  const trailPositionsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(-10, -10)),
  );
  const trailSizesRef = useRef(new Array(TRAIL_LENGTH).fill(0));
  const trailIndexRef = useRef(0);
  const lastDropPosRef = useRef(new THREE.Vector2(-10, -10));

  // Arreglos de estado para las salpicaduras
  const splashPositionsRef = useRef(
    Array.from({ length: SPLASH_LENGTH }, () => new THREE.Vector2(-10, -10)),
  );
  const splashVelocitiesRef = useRef(
    Array.from({ length: SPLASH_LENGTH }, () => new THREE.Vector2(0, 0)),
  );
  const splashSizesRef = useRef(new Array(SPLASH_LENGTH).fill(0));
  const splashIndexRef = useRef(0);

  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
  const smoothVelocityRef = useRef(new THREE.Vector2(0, 0));

  // --- Refs para el Fantasma ---
  const lastInteractionTimeRef = useRef(Date.now());
  const ghostNextMoveTimeRef = useRef(0);
  const ghostActiveUntilRef = useRef(0);

  const ghostStartRef = useRef(new THREE.Vector2());
  const ghostControlRef = useRef(new THREE.Vector2());
  const ghostEndRef = useRef(new THREE.Vector2());

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

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const geishaElement = geishaRef.current;
      if (!geishaElement) return; // Quitamos el bloqueo táctil

      const rect = geishaElement.getBoundingClientRect();
      const rawX = (event.clientX - rect.left) / rect.width;
      const rawY = 1 - (event.clientY - rect.top) / rect.height;
      const x = Math.min(Math.max(rawX, 0), 1);
      const y = Math.min(Math.max(rawY, 0), 1);

      targetMouseRef.current.set(x, y);
      targetHoverStateRef.current = 1; // Enciende el efecto al tocar
      lastInteractionTimeRef.current = Date.now(); // Resetear el cronómetro del fantasma
    },
    [],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      handlePointerMove(event);
    },
    [handlePointerMove],
  );

  const handlePointerLeave = useCallback(() => {
    targetHoverStateRef.current = 0; // Apaga suavemente al levantar el dedo
  }, []);

  const handleImageEnter = useCallback(() => {
    targetHoverStateRef.current = 1;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const handleImageLeave = useCallback(() => {
    targetHoverStateRef.current = 0;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const syncMode = () => {
      const coarse = mediaQuery.matches;
      isCoarsePointerRef.current = coarse;
      setIsCoarsePointer(coarse);
      // Hemos eliminado la forzatura del mouse al (0.5, 0.5) para dejar que el dedo dirija.
    };
    syncMode();
    mediaQuery.addEventListener("change", syncMode);
    return () => mediaQuery.removeEventListener("change", syncMode);
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
      clockRef.current = new THREE.Clock();

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
        )
          return;

        const delta = Math.min(clockRef.current.getDelta(), 1 / 30);
        const now = Date.now();

        // --- Lógica del Fantasma (S-curve agresiva) ---
        const isIdle =
          now - lastInteractionTimeRef.current > GHOST_IDLE_THRESHOLD;
        if (isIdle) {
          if (now > ghostNextMoveTimeRef.current) {
            ghostActiveUntilRef.current = now + GHOST_MOVE_DURATION;

            // Teletransportar al punto de inicio sin salto visual
            const startX = 0.5 + Math.sin(now * 0.001) * 0.08;
            ghostStartRef.current.set(startX, 0.88);
            ghostEndRef.current.set(startX, 0.12);

            targetMouseRef.current.copy(ghostStartRef.current);
            smoothMouseRef.current.copy(ghostStartRef.current);
            mouseVelocityRef.current.set(0, 0);
            smoothVelocityRef.current.set(0, 0);

            targetHoverStateRef.current = 1;

            // Pausa corta entre repeticiones
            ghostNextMoveTimeRef.current =
              now +
              GHOST_MOVE_DURATION +
              GHOST_PAUSE_MIN +
              Math.random() * (GHOST_PAUSE_MAX - GHOST_PAUSE_MIN);
          }

          if (now < ghostActiveUntilRef.current) {
            const progress =
              1 - (ghostActiveUntilRef.current - now) / GHOST_MOVE_DURATION;

            // Easing cuártico agresivo: arranque y frenado bruscos, rápido en el centro
            const eased =
              progress < 0.5
                ? 8 * progress * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 4) / 2;

            // Trayectoria en S: recorrido vertical completo con ondulación lateral fuerte
            const ghostY =
              ghostStartRef.current.y +
              (ghostEndRef.current.y - ghostStartRef.current.y) * eased;

            // Ondulación S pronunciada (3 semi-ondas)
            const sWave = Math.sin(eased * Math.PI * 3) * 0.2;
            // Drift asimétrico para romper la simetría
            const drift = Math.sin(eased * Math.PI * 1.7 + 0.5) * 0.07;
            // Micro-temblor de mano
            const noiseX = Math.sin(now * 0.005) * 0.005;
            const noiseY = Math.cos(now * 0.007) * 0.003;
            const ghostX = ghostStartRef.current.x + sWave + drift + noiseX;

            targetMouseRef.current.set(ghostX, ghostY + noiseY);

            // Radio forzado grande que se mantiene durante el 80% central del trazo
            const fadeIn = Math.min(progress * 6, 1);
            const fadeOut = Math.min((1 - progress) * 6, 1);
            uniformsRef.current.u_radius.value =
              GHOST_FORCED_RADIUS * fadeIn * fadeOut;
          } else if (targetHoverStateRef.current === 1) {
            targetHoverStateRef.current = 0;
          }
        }

        // Calcular la inercia real
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

        // 1. DINÁMICA DE APARICIÓN POR MOVIMIENTO
        smoothVelocityRef.current.lerp(mouseVelocityRef.current, 0.2);
        const velocityMagnitude = smoothVelocityRef.current.length();

        // 🟢 NUEVO: Si es táctil, hacemos la pintura MÁS GRANDE para que se vea claro debajo del dedo
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

        // Solo aplicar el radius del mouse real si el fantasma no está activo
        if (!(isIdle && now < ghostActiveUntilRef.current)) {
          uniformsRef.current.u_radius.value +=
            (targetRadius - uniformsRef.current.u_radius.value) *
            RADIUS_STIFFNESS *
            delta;
        }

        // 2. SISTEMA FÍSICO DE GOTEO
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

        // 3. ENCOGIMIENTO INERCIAL (Shrink)
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          if (trailSizesRef.current[i] > 0) {
            trailSizesRef.current[i] = Math.max(
              0,
              trailSizesRef.current[i] - delta * TRAIL_SHRINK_SPEED,
            );
          }
        }

        // 4. SALPICADURAS (Splashes)
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

        currentHoverStateRef.current +=
          (targetHoverStateRef.current - currentHoverStateRef.current) *
          delta *
          12;

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
      if (animationRef.current !== null)
        cancelAnimationFrame(animationRef.current);
      resizeObserver?.disconnect();
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="center"
      className={isCoarsePointer ? "is-coarse" : ""}
      style={visualControlsStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={stageRef}
        className="media-stage"
        onMouseEnter={handleImageEnter}
        onMouseLeave={handleImageLeave}
      >
        <div className="heroContent">
          <TextType
            as="h1"
            className="title"
            text={["Conoce", "Viaja a", "Disfruta"]}
            typingSpeed={40}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            cursorBlinkDuration={0.4}
          />
          <h2 className="subtitle">Japon</h2>
          <div className="buttons-cta">
            <Button variant="primary">Diseña tu viaje</Button>
            <Button variant="secondary">Ver Destinos</Button>
          </div>
        </div>
        <div ref={geishaRef} className="geisha">
          <img src={geisha} alt="Geisha" className="geisha-image" />
          <div
            ref={overlayRef}
            className="samurai-overlay"
            aria-hidden="true"
          />
          <div className="circle"></div>
        </div>
      </div>
    </section>
  );
}

export default App;
