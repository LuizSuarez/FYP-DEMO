const crypto = require('crypto');
const fs = require('fs');

const MASTER_KEY_HEX = process.env.FILE_MASTER_KEY_HEX || null;

// Validate master key
let MASTER_KEY_BUFFER = null;
if (MASTER_KEY_HEX) {
  try {
    MASTER_KEY_BUFFER = Buffer.from(MASTER_KEY_HEX, 'hex');
    if (MASTER_KEY_BUFFER.length !== 32) {
      console.warn('❌ FILE_MASTER_KEY_HEX must be 64 hex chars (32 bytes). Falling back to raw per-file keys.');
      MASTER_KEY_BUFFER = null;
    }
  } catch (err) {
    console.warn('❌ Invalid FILE_MASTER_KEY_HEX. Falling back to raw per-file keys.');
    MASTER_KEY_BUFFER = null;
  }
} else {
  console.warn('⚠️ FILE_MASTER_KEY_HEX not set. Storing raw per-file keys (INSECURE).');
}

function encryptPerFileKey(perFileKeyBuffer) {
  if (!perFileKeyBuffer || perFileKeyBuffer.length !== 32) {
    throw new Error('Per-file key must be 32 bytes for AES-256');
  }

  if (!MASTER_KEY_BUFFER) {
    // fallback: store raw key (hex)
    return perFileKeyBuffer.toString('hex');
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_KEY_BUFFER, iv);
  const ct = Buffer.concat([cipher.update(perFileKeyBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('hex');
}

function decryptPerFileKey(encryptedHex) {
  if (!MASTER_KEY_BUFFER) {
    // fallback: assume encryptedHex is raw per-file key hex
    return Buffer.from(encryptedHex, 'hex');
  }

  const enc = Buffer.from(encryptedHex, 'hex');
  const iv = enc.slice(0, 12);
  const tag = enc.slice(12, 28);
  const ct = enc.slice(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_KEY_BUFFER, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);

  if (plain.length !== 32) {
    throw new Error('Decrypted per-file key length is invalid');
  }

  return plain;
}

// SHA256 helpers
function sha256HexOfBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256HexOfFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('data', chunk => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
    rs.on('error', reject);
  });
}

module.exports = {
  encryptPerFileKey,
  decryptPerFileKey,
  sha256HexOfBuffer,
  sha256HexOfFile
};
