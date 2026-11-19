'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const t = require('../src/tools');
const { run } = require('../src/cli');

function capture(argv) {
  const out = [], err = [];
  const code = run(argv, { out: (s) => out.push(s), err: (s) => err.push(s) });
  return { code, out, err };
}

test('json format dan minify', () => {
  assert.equal(t.jsonFormat('{"a":1,"b":[2]}'), '{\n  "a": 1,\n  "b": [\n    2\n  ]\n}');
  assert.equal(t.jsonMinify('{ "a": 1,\n "b": 2 }'), '{"a":1,"b":2}');
  assert.throws(() => t.jsonFormat('{rusak'));
});

test('base64 round trip termasuk unicode', () => {
  const text = 'Halo dunia ✓ é';
  assert.equal(t.base64Decode(t.base64Encode(text)), text);
  assert.equal(t.base64Encode('abc'), 'YWJj');
  assert.throws(() => t.base64Decode('***'), /base64/);
});

test('slugify', () => {
  assert.equal(t.slugify('  Halo, Dunia! Café Ñandú  '), 'halo-dunia-cafe-nandu');
  assert.equal(t.slugify('---A__B---'), 'a-b');
});

test('hash', () => {
  assert.equal(t.hash('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(t.hash('abc', 'md5'), '900150983cd24fb0d6963f7d28e17f72');
  assert.throws(() => t.hash('abc', 'tidak-ada'), /tidak didukung/);
});

test('uuid unik dan berformat v4', () => {
  const ids = t.uuid(20);
  assert.equal(new Set(ids).size, 20);
  ids.forEach((id) => assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
});

test('password memenuhi panjang dan variasi karakter', () => {
  for (let i = 0; i < 50; i++) {
    const p = t.password(12);
    assert.equal(p.length, 12);
    assert.match(p, /[a-z]/);
    assert.match(p, /[A-Z]/);
    assert.match(p, /\d/);
    assert.match(p, /[!@#$%^&*()\-_=+]/);
  }
  assert.match(t.password(20, { symbols: false }), /^[A-Za-z0-9]{20}$/);
  assert.throws(() => t.password(4), /8-128/);
});

test('timestamp', () => {
  assert.deepEqual(t.timestamp('0'), { unix: 0, iso: '1970-01-01T00:00:00.000Z' });
  assert.equal(t.timestamp('1700000000').iso, '2023-11-14T22:13:20.000Z');
  assert.equal(t.timestamp('1700000000000').unix, 1700000000);
  assert.equal(t.timestamp('2023-11-14T22:13:20Z').unix, 1700000000);
  assert.throws(() => t.timestamp('bukan tanggal'), /tidak valid/);
});

test('CLI: kode keluar dan output', () => {
  assert.deepEqual(capture(['slug', 'Halo', 'Dunia']).out, ['halo-dunia']);
  assert.deepEqual(capture(['b64', 'encode', 'abc']).out, ['YWJj']);
  assert.equal(capture(['uuid', '3']).out.length, 3);
  assert.equal(capture(['uuid', '0']).code, 1);
  assert.equal(capture(['pass', '--no-symbols', '10']).out[0].length, 10);
  assert.equal(capture(['hash']).code, 1);
  assert.equal(capture(['xyz']).code, 1);
  assert.equal(capture([]).code, 0);
});
