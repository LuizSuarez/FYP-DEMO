// middleware/upload.js
const multer = require('multer');

const storage = multer.memoryStorage();

const maxSize = parseInt(process.env.MAX_FILE_SIZE || (200 * 1024 * 1024), 10); // default 200MB

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const ok = ['.fasta', '.fa', '.vcf', '.gff', '.gff3'].some(ext => file.originalname.toLowerCase().endsWith(ext));
    if (!ok) return cb(new Error('Only FASTA/VCF/GFF files allowed'));
    cb(null, true);
  }
});

module.exports = upload;
