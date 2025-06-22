# THORChain Explorer Interface

## Usage

before serving or building the repo add `.env` file to the root folder with current `NETWORK` variable

```bash
# Network can be "stagenet" or "testnet"
NETWORK="mainnet"
```

## Local Development with Custom THORChain Network

This explorer can be configured to work with a local THORChain network using the `NETWORK=local` environment variable.

### Setup for Local Network

1. Start your local THORChain network (e.g., using Kurtosis)
2. Update the port mappings in `api/endpoints.js` if needed
3. Set the environment variable: `NETWORK=local`
4. Run the explorer: `npm run dev`

### Available Features in Local Mode

When running with `NETWORK=local`, the following core blockchain explorer features are available:

- **Network Information**: View network statistics and parameters
- **Node Status**: Monitor validator nodes and their status
- **Block Explorer**: Browse latest blocks and blockchain data
- **Transaction Viewing**: View individual transactions and their details
- **Real-time Data**: Live updates from the local THORChain node

### Disabled Features in Local Mode

The following advanced features require external services (Midgard, custom backend) and are disabled in local mode:

- **Analytics Dashboards**: Historical charts and statistics
- **Advanced Transaction Analysis**: Detailed swap and liquidity analytics  
- **Pool Statistics**: Historical pool performance data
- **Earnings History**: Node and network earnings analytics
- **Affiliate Tracking**: Affiliate swap statistics
- **Price Data**: RUNE price information and market data

### Local Network Endpoints

The local configuration uses the following endpoints:
- **THORNode API**: `http://127.0.0.1:32776/` (adjust port as needed)
- **Tendermint RPC**: `http://127.0.0.1:32779/` (adjust port as needed)
- **Midgard API**: Disabled (null)
- **Custom Backend**: Disabled (null)

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm dev

# build for production and launch server
$ npm build
$ npm start

# generate static project
$ npm generate
```

Project is based on NuxtJS
For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories (NuxtJS)

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
