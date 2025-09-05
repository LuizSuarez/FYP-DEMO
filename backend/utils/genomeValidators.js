// utils/genomeValidators.js
const path = require('path');

function inferType(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  if (ext === '.fasta' || ext === '.fa') return 'fasta';
  if (ext === '.vcf') return 'vcf';
  if (ext === '.gff' || ext === '.gff3') return 'gff';
  return 'unknown';
}

function looksLikeFASTA(buffer) {
  try {
    const s = buffer.toString('utf8', 0, Math.min(buffer.length, 4096)).trim();
    return s.startsWith('>');
  } catch (e) {
    return false;
  }
}

function looksLikeVCF(buffer) {
  try {
    const s = buffer.toString('utf8', 0, Math.min(buffer.length, 8192));
    return s.includes('#CHROM') || s.includes('##fileformat=');
  } catch (e) {
    return false;
  }
}

function looksLikeGFF(buffer) {
  try {
    const s = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
    return s.includes('##gff-version') || s.split('\n')[0].startsWith('#') || s.split('\n')[0].split('\t').length >= 9;
  } catch (e) {
    return false;
  }
}

module.exports = {
  inferType,
  looksLikeFASTA,
  looksLikeVCF,
  looksLikeGFF
};
