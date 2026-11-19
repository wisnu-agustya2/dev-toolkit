# dev-toolkit

CLI utilitas harian untuk developer (`dtk`). Tanpa dependency, hanya Node.js 18 atau lebih baru.

## Perintah
| Perintah | Fungsi |
|---|---|
| `dtk json format [file]` | Rapikan JSON (baca stdin jika tanpa file) |
| `dtk json minify [file]` | Ringkas JSON |
| `dtk b64 encode\|decode <teks>` | Base64, mendukung unicode |
| `dtk slug <teks>` | Buat slug URL, aksen dihapus |
| `dtk hash <teks> [algoritma]` | Hash (default sha256) |
| `dtk uuid [jumlah]` | UUID v4 (1-100) |
| `dtk pass [panjang] [--no-symbols]` | Password acak aman secara kriptografi (8-128) |
| `dtk ts [now\|unix\|tanggal]` | Konversi timestamp unix dan ISO |

## Pemasangan
```bash
git clone https://github.com/wisnu-agustya2/dev-toolkit.git
cd dev-toolkit
npm link          # membuat perintah global `dtk`
```
Atau jalankan langsung: `node bin/dtk.js help`.

## Contoh
```bash
$ echo '{"a":1}' | dtk json format
{
  "a": 1
}
$ dtk slug "Belajar Node.js Itu Asyik"
belajar-node-js-itu-asyik
$ dtk ts 1700000000
unix: 1700000000
iso:  2023-11-14T22:13:20.000Z
```

## Tes
```bash
npm test
```

## Lisensi
MIT
