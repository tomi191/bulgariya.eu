import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise: Promise<any> | null = null

export async function getDeviceFingerprint(): Promise<string> {
  // Initialize FingerprintJS only once
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }

  const fp = await fpPromise
  const result = await fp.get()

  // Return the visitor ID which is a unique device fingerprint
  return result.visitorId
}
