import endpoints from './endpoints'
import { $axiosInstace } from './index'

export async function getDashboardData() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const [networkRes, poolsRes, nodesRes, runeSupplyRes, blockHeightRes] =
        await Promise.all([
          $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
          ),
          $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools'
          ),
          $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes'
          ),
          $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL +
              'thorchain/supply/rune'
          ),
          $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL +
              'thorchain/lastblock/thorchain'
          ),
        ])

      const network = networkRes.data
      const pools = poolsRes.data
      const nodes = nodesRes.data
      const runeSupply = runeSupplyRes.data
      const lastBlock = blockHeightRes.data

      const activePools = pools.filter((pool) => pool.status === 'Available')
      const totalPoolDepth = activePools.reduce(
        (sum, pool) => sum + parseInt(pool.balance_rune || 0),
        0
      )

      const dashboardData = {
        stats: {
          swapCount24h: network.swap_count_24h || 0,
          volume24USD: network.swap_volume_24h || 0,
          earnings24: network.earnings_24h || 0,
          totalPoolDepth,
          totalActivePools: activePools.length,
          totalNodes: nodes.length,
          activeNodes: nodes.filter((node) => node.status === 'Active').length,
        },
        runeSupply: {
          amount: {
            amount: runeSupply.amount || '0',
          },
        },
        lastBlockHeight: lastBlock.thorchain || 0,
        txs: {
          actions: [],
        },
        addresses: {
          pagination: {
            total: 0,
          },
        },
      }

      return { data: dashboardData }
    } catch (error) {
      console.error('Error constructing dashboard data from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct dashboard data from THORNode APIs')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/dashboardData'
  )
}

export async function getDashboardPlots() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
      )
      const network = networkRes.data

      const plots = {
        swapVolume: [
          {
            time: new Date().toISOString(),
            volume: network.swap_volume_24h || 0,
          },
        ],
        earnings: [
          {
            time: new Date().toISOString(),
            earnings: network.earnings_24h || 0,
          },
        ],
      }

      return { data: plots }
    } catch (error) {
      console.error('Error constructing dashboard plots from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct dashboard plots from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/dashboardPlots'
  )
}

export async function getExraNodesInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes'
      )
      return { data: nodesRes.data }
    } catch (error) {
      console.error('Error fetching extra nodes info from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch extra nodes info from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/extraNodesInfo'
  )
}

export async function getSaversInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const saversRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/savers'
      )
      return { data: saversRes.data }
    } catch (error) {
      console.error('Error fetching savers from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch savers from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/saversInfo'
  )
}

export async function getChainsHeight() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const blockRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/lastblock'
      )
      const chains = blockRes.data || []

      const chainsHeight = chains.reduce((acc, chain) => {
        acc[chain.chain] = chain.last_observed_in
        return acc
      }, {})

      return { data: chainsHeight }
    } catch (error) {
      console.error('Error fetching chains height from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch chains height from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/chainsHeight'
  )
}

export async function getHolders(asset = 'THOR.RUNE') {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const holders = []
      return { data: holders }
    } catch (error) {
      console.error('Error constructing holders data from THORNode:', error)
      return Promise.reject(
        new Error('Holders data not available from THORNode API')
      )
    }
  }
  const baseUrl = endpoints[process.env.NETWORK].SERVER_URL + 'holders'
  return $axiosInstace.get(baseUrl, {
    params: { asset },
  })
}

export async function getPoolsHistory(period = '') {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools'
      )
      const pools = poolsRes.data

      const poolsHistory = pools.map((pool) => ({
        pool: pool.asset,
        assetDepth: pool.balance_asset || '0',
        runeDepth: pool.balance_rune || '0',
        assetPrice: pool.asset_price || '0',
        assetPriceUSD: pool.asset_price_usd || '0',
        liquidityUnits: pool.LP_units || '0',
        synthUnits: pool.synth_units || '0',
        synthSupply: pool.synth_supply || '0',
        units: pool.pool_units || '0',
        volume24h: pool.volume_24h || '0',
        volumeTotal: pool.volume_total || '0',
        fees24h: pool.fees_24h || '0',
        feesTotal: pool.fees_total || '0',
        status: pool.status || 'Unknown',
      }))

      return { data: poolsHistory }
    } catch (error) {
      console.error('Error constructing pools history from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct pools history from THORNode APIs')
      )
    }
  }
  if (period === 'day') {
    period = ''
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/historyPools' + period
  )
}

export function getOldPoolsHistory(period = '') {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    return { data: [] }
  }
  if (period === 'day') {
    period = ''
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/oldHistoryPools' + period
  )
}

export async function getServerTx(txid) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const txRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + `thorchain/tx/${txid}`
      )
      return { data: txRes.data }
    } catch (error) {
      console.error('Error fetching transaction from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch transaction from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + `tx/${txid}`
  )
}

export async function getRunePoolsInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools'
      )
      const pools = poolsRes.data.filter((pool) => pool.asset === 'THOR.RUNE')
      return { data: pools }
    } catch (error) {
      console.error('Error fetching rune pools from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch rune pools from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/runePools'
  )
}

export async function getOldRunePools() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing old rune pools from THORNode:', error)
      return Promise.reject(
        new Error('Old rune pools not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/oldRunePool'
  )
}

export async function getOldRunePoolProvidersInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing old rune pool providers from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Old rune pool providers not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/oldRunePoolProviders'
  )
}

export async function getRunePoolProvidersInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const providersRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/rune_providers'
      )
      return { data: providersRes.data }
    } catch (error) {
      console.error('Error fetching rune pool providers from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch rune pool providers from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/runePoolProviders'
  )
}

export async function getBorrowersInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const borrowersRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/borrowers'
      )
      return { data: borrowersRes.data }
    } catch (error) {
      console.error('Error fetching borrowers from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch borrowers from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/borrowers'
  )
}

export async function getSwapsWeekly() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing weekly swaps from THORNode:', error)
      return Promise.reject(
        new Error('Weekly swaps data not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/swapsWeekly'
  )
}

export async function getStatsDaily() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
      )
      const network = networkRes.data

      const statsDaily = [
        {
          date: new Date().toISOString(),
          swapVolume: network.swap_volume_24h || '0',
          swapCount: network.swap_count_24h || '0',
          earnings: network.earnings_24h || '0',
        },
      ]

      return { data: statsDaily }
    } catch (error) {
      console.error('Error constructing daily stats from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct daily stats from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/statsDaily'
  )
}

export async function getFeesRewardsMonthly() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
      )
      const network = networkRes.data

      const feesRewards = [
        {
          date: new Date().toISOString(),
          liquidityFees: network.liquidity_fees_24h || '0',
          blockRewards: network.block_rewards_24h || '0',
          bondingEarnings: network.bonding_earnings_24h || '0',
        },
      ]

      return { data: feesRewards }
    } catch (error) {
      console.error('Error constructing fees rewards from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct fees rewards from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/feesRewardsMonthly'
  )
}

export async function getAffiliateSwapsByWallet() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing affiliate swaps by wallet from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Affiliate swaps by wallet not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/affiliateSwapsByWallet'
  )
}

export async function getAffiliateSwapsWeekly() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing affiliate swaps weekly from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Affiliate swaps weekly not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/affiliateSwapsWeekly'
  )
}

export async function getAffiliateSwapsDaily() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing affiliate swaps daily from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Affiliate swaps daily not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/affiliateSwapsDaily'
  )
}

export async function getNodeOverview() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes'
      )
      const nodes = nodesRes.data

      const nodeOverview = {
        totalNodes: nodes.length,
        activeNodes: nodes.filter((node) => node.status === 'Active').length,
        standbyNodes: nodes.filter((node) => node.status === 'Standby').length,
        readyNodes: nodes.filter((node) => node.status === 'Ready').length,
      }

      return { data: nodeOverview }
    } catch (error) {
      console.error('Error constructing node overview from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct node overview from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/nodeOverview'
  )
}

export async function getAffiliateDaily() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing affiliate daily from THORNode:', error)
      return Promise.reject(
        new Error('Affiliate daily not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/affiliateDaily'
  )
}

let fetchDataCancel = null

export async function getActions(params) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const actions = []
      const meta = {
        nextPageToken: null,
        prevPageToken: null,
      }

      if (params.txid) {
        try {
          const txRes = await $axiosInstace.get(
            endpoints[process.env.NETWORK].THORNODE_URL +
              `thorchain/tx/${params.txid}`
          )
          const tx = txRes.data

          if (tx) {
            actions.push({
              date: tx.timestamp || new Date().toISOString(),
              height: tx.height || 0,
              in: tx.tx?.coins || [],
              out: tx.out_txs || [],
              fees: tx.tx?.fee || [],
              status: tx.status || 'success',
              type: tx.type || 'unknown',
              pools: [],
              metadata: {
                swap: {},
                addLiquidity: {},
                withdraw: {},
              },
            })
          }
        } catch (txError) {
          console.warn('Transaction not found in THORNode:', params.txid)
        }
      }

      return {
        data: {
          actions,
          count: actions.length.toString(),
          meta,
        },
      }
    } catch (error) {
      console.error('Error constructing actions from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct actions from THORNode APIs')
      )
    }
  }

  if (fetchDataCancel) {
    fetchDataCancel.cancel('cancel')
  }

  fetchDataCancel = $axiosInstace.CancelToken.source()

  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'actions',
    { params, cancelToken: fetchDataCancel.token }
  )
}

export async function getCoinMarketInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: {} }
    } catch (error) {
      console.error('Error constructing coin market info from THORNode:', error)
      return Promise.reject(
        new Error('Coin market info not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/coinmarketCap'
  )
}

export async function getNodesInfo() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes'
      )
      return { data: nodesRes.data }
    } catch (error) {
      console.error('Error fetching nodes info from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch nodes info from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/nodesInfo'
  )
}

export async function getTopSwaps() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing top swaps from THORNode:', error)
      return Promise.reject(
        new Error('Top swaps not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/swaps'
  )
}

export async function getTopSwapsWeekly() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing top swaps weekly from THORNode:', error)
      return Promise.reject(
        new Error('Top swaps weekly not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/swapsTopWeekly'
  )
}

export async function getTopSwapsMonthly() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing top swaps monthly from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Top swaps monthly not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/swapsTopMonthly'
  )
}

export async function getEarnings() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
      )
      const network = networkRes.data

      const earnings = {
        intervals: [
          {
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date().toISOString(),
            liquidityEarnings: network.liquidity_earnings_24h || '0',
            blockRewards: network.block_rewards_24h || '0',
            earnings: network.earnings_24h || '0',
            bondingEarnings: network.bonding_earnings_24h || '0',
            liquidityFees: network.liquidity_fees_24h || '0',
          },
        ],
        meta: {
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date().toISOString(),
          liquidityEarnings: network.liquidity_earnings_24h || '0',
          blockRewards: network.block_rewards_24h || '0',
          earnings: network.earnings_24h || '0',
          bondingEarnings: network.bonding_earnings_24h || '0',
          liquidityFees: network.liquidity_fees_24h || '0',
        },
      }

      return { data: earnings }
    } catch (error) {
      console.error('Error constructing earnings from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct earnings from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/rawEarnings'
  )
}

export async function getNodes() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes'
      )
      return { data: nodesRes.data }
    } catch (error) {
      console.error('Error fetching nodes from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch nodes from THORNode API')
      )
    }
  }
  return $axiosInstace.get(endpoints[process.env.NETWORK].SERVER_URL + 'nodes')
}

export async function getNetworkAllocation() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools'
      )
      const pools = poolsRes.data

      const allocation = pools.map((pool) => ({
        asset: pool.asset,
        allocation: parseFloat(pool.balance_rune || 0) / 1e8,
      }))

      return { data: allocation }
    } catch (error) {
      console.error(
        'Error constructing network allocation from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Failed to construct network allocation from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/networkAllocation'
  )
}

export async function getReserveHistory() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network'
      )
      const network = networkRes.data

      const reserveHistory = [
        {
          date: new Date().toISOString(),
          reserve: network.reserve || '0',
        },
      ]

      return { data: reserveHistory }
    } catch (error) {
      console.error('Error constructing reserve history from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct reserve history from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/reserve'
  )
}

export async function getVotes(period = '30d') {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const mimirRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/mimir'
      )
      const mimir = mimirRes.data

      const votes = Object.keys(mimir).map((key) => ({
        key,
        value: mimir[key],
        date: new Date().toISOString(),
      }))

      return { data: votes }
    } catch (error) {
      console.error('Error constructing votes from THORNode:', error)
      return Promise.reject(
        new Error('Failed to construct votes from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'votes',
    {
      params: {
        period,
      },
    }
  )
}

export async function getBurnedBlocks() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error('Error constructing burned blocks from THORNode:', error)
      return Promise.reject(
        new Error('Burned blocks not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/burned'
  )
}

export async function getInfraRUJIMerge() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: {} }
    } catch (error) {
      console.error('Error constructing RUJI merge from THORNode:', error)
      return Promise.reject(
        new Error('RUJI merge not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/rujiMerge'
  )
}

export function getExecutionQuality() {
  return $axiosInstace.get(
    'https://flipsidecrypto.xyz/api/v1/queries/6e18d4c9-3959-4791-a3b2-92a8f27cc120/data/latest'
  )
}

export async function getAffiliateHistory(params) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: [] }
    } catch (error) {
      console.error(
        'Error constructing affiliate history from THORNode:',
        error
      )
      return Promise.reject(
        new Error('Affiliate history not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'affiliate',
    {
      params,
    }
  )
}

export async function getTcyInfo(params) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      return { data: {} }
    } catch (error) {
      console.error('Error constructing TCY info from THORNode:', error)
      return Promise.reject(
        new Error('TCY info not available from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/tcyInfo',
    {
      params,
    }
  )
}

export async function getDenoms() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const assetsRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pool/assets'
      )
      return { data: assetsRes.data }
    } catch (error) {
      console.error('Error fetching denoms from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch denoms from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/denoms'
  )
}

export async function getContracts() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const inboundRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL +
          'thorchain/inbound_addresses'
      )
      return { data: inboundRes.data }
    } catch (error) {
      console.error('Error fetching contracts from THORNode:', error)
      return Promise.reject(
        new Error('Failed to fetch contracts from THORNode API')
      )
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/contracts'
  )
}
