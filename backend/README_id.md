<p style="text-align: center;">

<a href="https://www.arkademy.com/" target="blank"><img src="https://www.arkademy.com/img/logo%20arkademy-01.9c1222ba.png" width="300" alt="Arkademy" /></a>

# Point of Sales

[English](README.md)| **Bahasa Indonesia**

</p>

**_Point of Sales_** adalah program yang ditulis untuk Tugas Pekan 1 Bootcamp Arkademy Batch 12 Faztrack: Point of Sales Back-End.

## Daftar Isi

* [Point of Sales](#point-of-sales)
  * [Daftar Isi](#daftar-isi) 
  * [Stack yang Digunakan](#stack-yang-digunakan)
  * [Kebutuhan Sistem](#kebutuhan-sistem)
  * [Memulai](#memulai)
  * [Dokumentasi](#dokumentasi)
  * [Dibangun dengan](#dibangun-dengan)
  * [Kontribusi](#kontribusi)
  * [Manajemen Versi](#manajemen-versi)
  * [Penulis](#penulis)
  * [Lisensi](#lisensi)
  * [Pengakuan](#pengakuan)

## Stack yang Digunakan

Ini adalah stack yang digunakan di dalam program ini.

 * TypeScript
 * Babel
 * ExpressJS, Express Body Parser and Express CORS
 * Morgan
 * Helmet
 * JSON Web Token
 * MySQL and MySQL X Dev API (chosen by Database Factory)
 * UUID and Short UUID
 * bcrypt
 * Lodash
 * StackTraceJS
 * Chai and Mocha for Test Driven Development

## Kebutuhan Sistem

Program ini **membutuhkan perangkat lunak di bawah** terpasang di sistem Anda.

 * [Git](https://git-scm.com)
 * [NodeJS](https://nodejs.org)
 * [Yarn](https://yarnpkg.com)
 
Sebelum melanjutkan, pastikan perangkat lunak tersebut telah terpasang.

## Memulai

Untuk memulai, silakan **_clone_ repositori ini**.

```bash
git clone https://gitlab.com/danang-id/bcaf12-point-of-sales.git
cd bcaf12-point-of-sales
```

Kemudian, **pasang _dependencies_ proyek** menggunakan Yarn. Anda dapat menggunakan NPM, namun karena proyek telah menyertakan berkas `yarn.lock`, maka tidak direkomendasikan untuk menggunakan NPM, kecuali berkas tersebut dihapus.

```bash
yarn install
```

Untuk melihat proyek berjalan secara langsung, pertama **_build_ (bangun) proyek**.

```bash
yarn build
```

Proses pembangunan akan memakan beberapa waktu, bergantung pada peforma komputer. Setelah proses pembangunan selesai, **copy salin env contoh** menjadi berkas `.env`.

```bash
cp .env.example .env
```

Ubah berkas `.env` hingga memenuhi kebutuhan. Hal ini termasuk mengubah konfigurasi port HTTP dan basis data. Setelah selesai, Anda dapat **memulai program**. 

```bash
yarn start
```

Kecuali didefinisikan pada berkas `.env`, program akan berjalan pada localhost HTTP port 9000. Sehingga, base URL untuk setiap _endpoint_ adalah [http://localhost:9000](http://localhost:9000).

## Dokumentasi

Daftar _endpoint_ untuk program ini dijelaskan seperti berikut.


## Dibangun dengan

Ditulis dengan [TypeScript](https://typscriptlang.org/), dibangun menjadi ECMAScript 5 menggunakan **Babel** compiler.

## Kontribusi

Untuk memberikan kontribusi, cukup _fork_ proyek ini, kemudian tambahkan sebuah _pull request_.

## Manajemen Versi

Kami menggunakan [SemVer](http://semver.org/) untuk manajemen versi. Untuk melihat versi yang tersedia, periksa [tag pada proyek ini](https://gitlab.com/danang-id/bcaf12-point-of-sales/tags).

## Penulis

* **Danang Galuh Tegar Prasetyo** - _Pemulai proyek_ - [danang-id](https://gitlab.com/danang-id)

Lihat juga daftar [kontributor-kontributor](https://gitlab.com/danang-id/bcaf12-point-of-sales/-/graphs/master) yang telah berpartisipasi dalam proyek ini.

## Lisensi

Proyek ini dilisensikan di bawah **Lisensi Apache 2.0** - silakan lihat berkas [LICENSE](LICENSE) untuk detil.

## Pengakuan

Program ini ditulis dan diajukan untuk Bootcamp Arkademy Batch 12 Faztrack: Tugas Pekan 1.