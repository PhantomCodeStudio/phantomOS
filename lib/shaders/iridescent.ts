// lib/shaders/iridescent.ts
import { shaderMaterial } from '@react-three/drei'
import { Color, Texture, Vector3 } from 'three'
import { extend } from '@react-three/fiber'
import type { ShaderMaterial } from 'three'

const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uCameraPosition;
  uniform vec3  uColor;
  uniform sampler2D uAlphaMap;
  uniform bool uUseAlphaMap;
  uniform float uFresnelPower;
  uniform float uRefractionStrength;
  uniform float uAlpha;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  void main() {
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);

    float hue = fresnel * 1.5 + uTime * 0.08;
    vec3 rainbow = hsl2rgb(vec3(mod(hue, 1.0), 0.9, 0.6));

    vec3 color = mix(uColor, rainbow, fresnel * 0.8);
    float alpha = mix(uAlpha * 0.3, uAlpha, fresnel);

    float alphaMask = uUseAlphaMap ? texture2D(uAlphaMap, vUv).a : 1.0;
    gl_FragColor = vec4(color, alpha * alphaMask);
  }
`

export const IridescentMaterial = shaderMaterial(
  {
    uTime:               0,
    uCameraPosition:     new Vector3(),
    uColor:              new Color('#4169FF'),
    uAlphaMap:           new Texture(),
    uUseAlphaMap:        false,
    uFresnelPower:       3.0,
    uRefractionStrength: 0.15,
    uAlpha:              0.85,
  },
  vertexShader,
  fragmentShader,
)

extend({ IridescentMaterial })

export type IridescentMaterialUniforms = {
  uTime: number
  uCameraPosition: Vector3
  uColor: Color
  uAlphaMap: Texture
  uUseAlphaMap: boolean
  uFresnelPower: number
  uRefractionStrength: number
  uAlpha: number
}

export type IridescentMaterialInstance = ShaderMaterial & IridescentMaterialUniforms

declare module '@react-three/fiber' {
  interface ThreeElements {
    iridescentMaterial: import('@react-three/fiber').ThreeElements['shaderMaterial'] & Partial<IridescentMaterialUniforms>
  }
}
