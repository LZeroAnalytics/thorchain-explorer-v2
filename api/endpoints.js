module.exports = {
  mainnet: {
    MIDGARD_BASE_URL: 'https://midgard.ninerealms.com/v2/',
    MIDGARD_GRAPH_QL: 'https://midgard.ninerealms.com/v2',
    ARCHIVE_THORNODE: 'https://thornode-v1.ninerealms.com/',
    THORNODE_URL: 'https://thornode.ninerealms.com/',
    TENDERMINT_URL: 'https://rpc.ninerealms.com/',
    SERVER_URL: 'https://vanaheimex.com/',
    MODULE_ADDR: 'thor1dheycdevq39qlkxs2a6wuuzyn4aqxhve4qxtxt',
  },
  stagenet: {
    MIDGARD_BASE_URL: 'https://stagenet-midgard.ninerealms.com/v2/',
    MIDGARD_GRAPH_QL: 'https://stagenet-midgard.ninerealms.com/v2',
    THORNODE_URL: 'https://stagenet-thornode.ninerealms.com/',
    TENDERMINT_URL: 'https://stagenet-rpc.ninerealms.com/',
    SERVER_URL: 'https://vanaheimex.com/stage/',
    MODULE_ADDR: 'sthor1dheycdevq39qlkxs2a6wuuzyn4aqxhvepe6as4',
  },
  local: {
    MIDGARD_BASE_URL: null,
    MIDGARD_GRAPH_QL: null,
    ARCHIVE_THORNODE: null,
    THORNODE_URL: 'http://127.0.0.1:32776/',
    TENDERMINT_URL: 'http://127.0.0.1:32779/',
    SERVER_URL: null,
    MODULE_ADDR: 'thor1dheycdevq39qlkxs2a6wuuzyn4aqxhve4qxtxt',
  },
}
