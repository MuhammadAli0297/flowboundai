declare module "wawoff2" {
  export function decompress(input: Buffer | Uint8Array): Promise<Uint8Array>
  export function compress(input: Buffer | Uint8Array): Promise<Uint8Array>
}
