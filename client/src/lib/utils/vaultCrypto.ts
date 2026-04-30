/**
 * Vault Encryption Utility
 * Uses AES-GCM for encryption/decryption
 * Uses PBKDF2 for key derivation from PIN
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives a CryptoKey from a PIN and salt (userId)
 */
export async function deriveKey(pin: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    const saltData = encoder.encode(salt);

    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        pinData,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltData,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        baseKey,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts data using the derived key
 * Returns a string format: "v1:nonce:ciphertext" (base64 encoded)
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(data);

    const ciphertext = await window.crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        encodedData
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64
    const base64 = btoa(String.fromCharCode(...combined));
    return `v1:${base64}`;
}

/**
 * Decrypts data using the derived key
 */
export async function decryptData(encryptedString: string, key: CryptoKey): Promise<string> {
    if (!encryptedString.startsWith('v1:')) {
        // Fallback for old unencrypted data
        return encryptedString;
    }

    const base64 = encryptedString.substring(3);
    const combined = new Uint8Array(
        atob(base64)
            .split('')
            .map((char) => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            ciphertext
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (err) {
        console.error('Decryption failed:', err);
        throw new Error('Could not decrypt data. Incorrect key?');
    }
}
