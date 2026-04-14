declare module "*.glb" {
  const content: string;
  export default content;
}

declare module "*.gltf" {
  const content: string;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}
