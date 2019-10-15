# Point of Sales

**English** | [Bahasa Indonesia](README_id.md)

**_Point of Sales_** is the program written for Task Week 1 of Bootcamp Arkademy Batch 12 Faztrack: Point of Sales Back-End.

## List of Contents

* [Point of Sales](#point-of-sales)
  * [List of Contents](#list-of-contents)
  * [Changes Log (What's New)](#changes-log-whats-new)
  * [System Requirement](#system-requirements)
  * [Getting Started](#getting-started)
  * [Documentation](#documentation)
  * [Built With](#built-with)
  * [Contribution](#contribution)
  * [Version Management](#version-management)
  * [Authors](#authors)
  * [License](#license)
  * [Acknowledgments](#acknowledgments)

## Changes Log (What's New)

* Initial commit with Babel and Typescript

## System Requirements

This program **requires these softwares** below to be installed in your system.

 * [Git](https://git-scm.com)
 * [NodeJS](https://nodejs.org)
 * [Yarn](https://yarnpkg.com)
 
Before continuing, please make sure the aforementioned softwares are installed.

## Getting Started

To start, please **clone this repository**.

```bash
git clone https://gitlab.com/danang-id/bcaf12-point-of-sales.git
cd bcaf12-point-of-sales
```

Then, **install project's dependencies** using Yarn. You might use NPM, but since Yarn lock file already provided, it's not recommended to use NPM unless `yarn.lock` file is removed.

```bash
yarn install
```

To see the project live on run, **build the project**.

```bash
yarn build
```

The build process may take a while, depending on your computer performance. After the build process has been finished, **copy the example env** into `.env` file.

```bash
cp .env.example .env
```

Modify `.env` to satisfy your needs. This may includes editing HTTP port or database configuration. After all set, you may **start the program**. 

```bash
yarn start
```

Unless defined in the `.env` file, the program should run on localhost HTTP port 9000. So, the base URL for the endpoints would be [http://localhost:9000](http://localhost:9000).

## Documentation

The list of endpoints for this program are described below.


## Built With

Written in [TypeScript](https://typscriptlang.org/), built into ECMAScript 5 using the **Babel** compiler.

## Contribution

To contribute, simply fork this project, and issue a pull request.

## Version Management

We use [SemVer](http://semver.org/) for version management. For the versions available, see the [tags on this repository](https://gitlab.com/danang-id/bcaf12-point-of-sales/tags).

## Authors

* **Danang Galuh Tegar Prasetyo** - _Initial work_ - [danang-id](https://gitlab.com/danang-id)

See also the list of [contributors](https://gitlab.com/danang-id/bcaf12-point-of-sales/-/graphs/master) who participated in this project.

## License

This project is licensed under the **Apache 2.0 License** - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This program is written and submitted for Bootcamp Arkademy Batch 12 Faztrack: Task Week 1.
