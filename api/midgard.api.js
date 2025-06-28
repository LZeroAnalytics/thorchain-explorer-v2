import endpoints from './endpoints'

// axios instance
import { getInfraEarnings } from './infra'
import { $axiosInstace } from './index'

export function getStats() {
  return $axiosInstace.get('stats')
}

export function getMidgardActions(params) {
  return $axiosInstace.get('actions', { params })
}

export function getTxs(offset = 0, limit = 10, OtherParams = undefined) {
  const params = {
    offset,
    limit,
    ...OtherParams,
  }

  return $axiosInstace.get('actions', { params })
}

export function getTx(txid, limit = 10) {
  const params = {
    offset: 0,
    limit,
    txid,
  }

  return $axiosInstace.get('actions', { params })
}

export function getAddress(address, offset = 0, limit = 10) {
  const params = {
    offset,
    limit,
    address,
  }

  return $axiosInstace.get('actions', { params })
}

export function getPoolTxs(poolName, offset = 0, limit = 10) {
  const params = {
    offset,
    limit,
    asset: poolName,
  }

  return $axiosInstace.get('actions', { params })
}

export async function getPools(period) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools')
      return { data: poolsRes.data }
    } catch (error) {
      console.error('Error fetching pools from THORNode:', error)
      return Promise.reject(new Error('Failed to fetch pools from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL +
      `pools?period=${period ?? '180d'}`
  )
}

export async function getPoolStats(poolName) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + `thorchain/pool/${poolName}`)
      const pool = poolRes.data
      
      const poolStats = {
        asset: pool.asset,
        assetDepth: pool.balance_asset || '0',
        runeDepth: pool.balance_rune || '0',
        poolUnits: pool.pool_units || '0',
        status: pool.status || 'Unknown',
        volume24h: pool.volume_24h || '0',
        volumeTotal: pool.volume_total || '0'
      }
      
      return { data: poolStats }
    } catch (error) {
      console.error('Error fetching pool stats from THORNode:', error)
      return Promise.reject(new Error('Failed to fetch pool stats from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL +
      `pool/${poolName}/stats?period=all`
  )
}

export function getPoolDepth(poolName, count = 30, from = undefined) {
  return $axiosInstace.get(
    `history/depths/${poolName}?interval=day&count=${count}` +
      (from ? `&from=${from}` : '')
  )
}

export function volumeHistory() {
  return $axiosInstace.get('history/liquidity_changes?interval=day&count=30')
}

export function swapHistory(count = 30) {
  return $axiosInstace.get(`history/swaps?interval=day&count=${count}`)
}

export function getSwapsHistory(params) {
  return $axiosInstace.get(`history/swaps`, {
    params,
  })
}

export function getTVLHistory(count = 90) {
  return $axiosInstace.get(`history/tvl?interval=day&count=${count}`)
}

export function getLastTvl() {
  return $axiosInstace.get('history/tvl')
}

export function earningsHistory() {
  return $axiosInstace.get('history/earnings?interval=day&count=30')
}
export function earnings(interval, count) {
  return $axiosInstace.get(
    `history/earnings?interval=${interval}&count=${count}`
  )
}

export function getEarningHistory(count = 30) {
  if (process.env.NETWORK === 'mainnet') {
    return getInfraEarnings({
      interval: 'day',
      count,
    })
  }
  return $axiosInstace.get(`history/earnings?interval=day&count=${count || 60}`)
}

export function earningLastDay() {
  return $axiosInstace.get('history/earnings?interval=day&count=2')
}

export function getPoolVolume(poolName) {
  return $axiosInstace.get(
    `history/liquidity_changes?pool=${poolName}&interval=day&count=30`
  )
}

export function getNetwork() {
  return $axiosInstace.get('network')
}

export async function getLatestBlocks(latestBlock, count = 10) {
  if (!latestBlock) {
    return
  }

  const axiosUrls = [...Array(latestBlock + 1).keys()]
    .slice(-1 * count)
    .map((b) => `debug/block/${b}`)

  const res = await Promise.all(
    axiosUrls.map((url) => $axiosInstace.get(url))
  ).then((data) => {
    const datum = []
    for (const d of data) {
      datum.push(d.data)
    }
    return datum
  })
  return res
}

export function getRevThorname(address) {
  return $axiosInstace.get(`thorname/rlookup/${address}`)
}

export function getMemberDetails(address) {
  return $axiosInstace.get(`member/${address}`)
}

export function getSaverDetails(address) {
  return $axiosInstace.get(`saver/${address}`)
}

export function getBorrowerDetails(address) {
  return $axiosInstace.get(`borrower/${address}`)
}

export function getTCYDistribution(address) {
  return $axiosInstace.get(`tcy/distribution/${address}`)
}
