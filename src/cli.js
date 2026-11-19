'use strict';
const fs = require('node:fs');
const t = require('./tools');

const HELP = `dev-toolkit - utilitas harian untuk developer

Penggunaan: dtk <perintah> [argumen]

Perintah:
  json <format|minify> [file]    Format/minify JSON (baca stdin jika file kosong)
  b64 <encode|decode> <teks>     Base64 encode/decode
  slug <teks>                    Ubah teks jadi slug URL
  hash <teks> [algoritma]        Hash teks (default sha256)
  uuid [jumlah]                  Buat UUID v4
  pass [panjang] [--no-symbols]  Buat password acak (default 16)
  ts [now|unix|tanggal]          Konversi timestamp
  help                           Tampilkan bantuan
`;

function readInput(file) {
  return fs.readFileSync(file || 0, 'utf8');
}

function run(argv, io = { out: console.log, err: console.error }) {
  const [cmd, ...args] = argv;
  try {
    switch (cmd) {
      case 'json': {
        const [mode, file] = args;
        if (mode === 'format') io.out(t.jsonFormat(readInput(file)));
        else if (mode === 'minify') io.out(t.jsonMinify(readInput(file)));
        else throw new Error('Gunakan: json <format|minify> [file]');
        return 0;
      }
      case 'b64': {
        const [mode, ...rest] = args;
        const text = rest.join(' ');
        if (!rest.length) throw new Error('Gunakan: b64 <encode|decode> <teks>');
        if (mode === 'encode') io.out(t.base64Encode(text));
        else if (mode === 'decode') io.out(t.base64Decode(text));
        else throw new Error('Gunakan: b64 <encode|decode> <teks>');
        return 0;
      }
      case 'slug':
        if (!args.length) throw new Error('Gunakan: slug <teks>');
        io.out(t.slugify(args.join(' ')));
        return 0;
      case 'hash':
        if (!args.length) throw new Error('Gunakan: hash <teks> [algoritma]');
        io.out(t.hash(args[0], args[1]));
        return 0;
      case 'uuid': {
        const n = args[0] === undefined ? 1 : Number(args[0]);
        if (!Number.isInteger(n) || n < 1 || n > 100) throw new Error('Jumlah UUID harus 1-100');
        t.uuid(n).forEach((u) => io.out(u));
        return 0;
      }
      case 'pass': {
        const symbols = !args.includes('--no-symbols');
        const lengthArg = args.find((a) => !a.startsWith('--'));
        io.out(t.password(lengthArg === undefined ? 16 : Number(lengthArg), { symbols }));
        return 0;
      }
      case 'ts': {
        const r = t.timestamp(args.join(' ') || undefined);
        io.out(`unix: ${r.unix}`);
        io.out(`iso:  ${r.iso}`);
        return 0;
      }
      case undefined:
      case 'help':
      case '--help':
      case '-h':
        io.out(HELP);
        return 0;
      default:
        io.err(`Perintah tidak dikenal: ${cmd}\n`);
        io.err(HELP);
        return 1;
    }
  } catch (e) {
    io.err(`Error: ${e.message}`);
    return 1;
  }
}

module.exports = { run };
