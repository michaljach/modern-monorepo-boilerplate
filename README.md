# `Modern Monorepo Boilerplate`
[![CircleCI](https://circleci.com/gh/michaljach/modern-monorepo-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/michaljach/modern-monorepo-boilerplate/tree/master)

## Usage
Running this project should be very easy, quick and automatic using monorepo apporach.

- Install [lerna](https://github.com/lerna/lerna) first: `npm i lerna -g`
- Run `npm run bootstrap` to install all dependencies and setup monorepo symlinks using [lerna](https://github.com/lerna/lerna).
- Run `npm start` to start development server with all packages included, by default you'll run `@namespace/react-app`.
- Run `npm test` to test all packages simultaneously.


## Setup explained

### Tooling

- Monorepo is done using npm and [lerna](https://github.com/lerna/lerna).
  - Packages are automatically linked together, meaning you can do cross-package work within the repo with hot module reloading and without any building.
  - Commonly used dependencies are hoisted from root, and only appear in the root `package.json`.
  - Running `npm run build` makes production-ready builds of all packages.
  - Running `npm test` runs tests for all packages at once.
  - Each package has its own `scripts` and `dependencies` keys. They are being installed in the root `node_modules` and you can still run standalone commands within each package from its `scripts`.
  - Adding new packages is as simple as dropping an existing package in the `packages` folder, and re-running `npm run bootstrap`.

- Sources and tests are written in strict [TypeScript](https://github.com/Microsoft/TypeScript).
  - We use a single, common, `tsconfig.json`, from which all other `tsconfig.json` files inherit (using `"extends"`).
  - Each project has `src` folder, each with their own `tsconfig.json`. This allows us to define which `@types` packages are accessible on a per-folder basis (`src` should not have access to `test` globals).

- Testing is done using [jest](https://jestjs.io/) and [enzyme](https://airbnb.io/enzyme/).
  - Light, battle-tested, projects with few dependencies.
  - Components are snapshot-tested.
  - All tests are written in TypeScript

### Included sample packages

- **@namespace/components**
  - [React](https://github.com/facebook/react) components library.
  - Built as `cjs` (Node consumption) and `esm` (bundler consumption).
  
 - **@namespace/react-app**
    - [React](https://github.com/facebook/react) application.
    - Built with minimal [CRA](https://github.com/facebook/create-react-app) setup.
    - Uses the `@namespace/components` package (also inside monorepo).

### Basic structure and configurations
```
packages/
    some-package/
        src/
            some-folder/
            index.ts         // combined exports
        jest.config.js       // config for jest testing framework
        tsconfig.json        // extends ./tsconfig.json
        package.json         // package-specific deps and scripts
        README.md            // docs are important

README.md         // docs are important
.gitignore        // github's default node gitignore with customizations
.eslintrc         // eslint config and rules
.npmrc            // internal npm repository config
lerna.json        // lerna configuration
LICENSE           // root license file. picked up by github
package.json      // common dev deps and workspace-wide scripts
tsconfig.json     // common typescript configuration
```

### Dependency management

Traditionally, working with projects in separate repositories makes it difficult to keep versions of `devDependencies` aligned, as each project can specify its own `devDependency` versions.
Monorepos simplify this, because `devDependencies` are shared between all packages within the monorepo.
Taking this into account, we use the following dependency structure:

- shared `dependencies` and `devDependencies` are placed in the root `package.json`
- `dependencies` and `devDependencies` are placed in the `package.json` of the relevant package requiring them, as each package is published separately

New `dependencies` can be added to the root `package.json` using npm:

```sh
npm install <package name> [-D]
```

Some packages depend on sibling packages within the monorepo. For example, in this repo, `@namespace/react-app` depends on `@namespace/components`. This relationship is just a normal dependency, and can be described in the `package.json` of `@namespace/react-app` like so:

```json
"dependencies": {
  "@namespace/components": "<package version>"
}
```
