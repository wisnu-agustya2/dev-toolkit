'use strict';
const crypto = require('node:crypto');

function jsonFormat(input, indent = 2) {
  return JSON.stringify(JSON.parse(input), null, indent);
}

function jsonMinify(input) {
  return JSON.stringify(JSON.parse(input));
}

function base64Encode(input) {
  return Buffer.from(input, 'utf8').toString('base64');
}

function base64Decode(input) {
  const clean = input.trim();
  if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(clean)) throw new Error('Input bukan base64 yang valid');
  return Buffer.from(clean, 'base64').toString('utf8');
}

function slugify(input) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hash(input, algorithm = 'sha256') {
  if (!crypto.getHashes().includes(algorithm)) throw new Error(`Algoritma tidak didukung: ${algorithm}`);
  return crypto.createHash(algorithm).update(input).digest('hex');
}

function uuid(count = 1) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

function password(length = 16, { symbols = true } = {}) {
  if (!Number.isInteger(length) || length < 8 || length > 128) throw new Error('Panjang password harus 8-128');
  const sets = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789'];
  if (symbols) sets.push('!@#$%^&*()-_=+');
  const all = sets.join('');
  // Jamin minimal satu karakter dari tiap set, sisanya acak (crypto.randomInt tidak bias)
  const chars = sets.map((s) => s[crypto.randomInt(s.length)]);
  while (chars.length < length) chars.push(all[crypto.randomInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function timestamp(input) {
  if (input === undefined || input === 'now') {
    const d = new Date();
    return { unix: Math.floor(d.getTime() / 1000), iso: d.toISOString() };
  }
  const isNumber = /^\d+$/.test(String(input));
  let d;
  if (isNumber) {
    const n = Number(input);
    d = new Date(n < 1e11 ? n * 1000 : n); // detik atau milidetik
  } else {
    d = new Date(input);
  }
  if (Number.isNaN(d.getTime())) throw new Error(`Tanggal tidak valid: ${input}`);
  return { unix: Math.floor(d.getTime() / 1000), iso: d.toISOString() };
}

module.exports = { jsonFormat, jsonMinify, base64Encode, base64Decode, slugify, hash, uuid, password, timestamp };
