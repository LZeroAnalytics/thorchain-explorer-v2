import endpoints from './endpoints'
import { $axiosInstace } from './index'

const INSIGHT_URL = 'https://flipsidecrypto.xyz/api/v1/queries/'

export async function getChurnHistory() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes')
      const nodes = nodesRes.data
      
      const churnHistory = nodes.filter(node => node.status === 'Standby' || node.status === 'Ready').map(node => ({
        height: node.status_since || 0,
        time: new Date().toISOString(),
        node_address: node.node_address,
        status: node.status
      }))

      return { data: churnHistory }
    } catch (error) {
      console.error('Error constructing churn history from THORNode:', error)
      return Promise.reject(new Error('Failed to construct churn history from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/churnHistory'
  )
}

export async function getFlipTVL() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools')
      const pools = poolsRes.data

      const totalTVL = pools.reduce((sum, pool) => {
        const runeDepth = parseInt(pool.balance_rune || 0)
        const assetDepth = parseInt(pool.balance_asset || 0)
        return sum + runeDepth + assetDepth
      }, 0)

      const tvlHistory = [{
        time: new Date().toISOString(),
        totalValuePooled: totalTVL
      }]

      return { data: tvlHistory }
    } catch (error) {
      console.error('Error constructing TVL history from THORNode:', error)
      return Promise.reject(new Error('Failed to construct TVL history from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/tvlHistoryQuery'
  )
}

export async function getRunePrice() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const poolsRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/pools')
      const pools = poolsRes.data

      const usdPool = pools.find(pool => pool.asset.includes('USD'))
      const runePrice = usdPool ? parseFloat(usdPool.asset_price_usd || '0') : 0

      return { data: { price: runePrice } }
    } catch (error) {
      console.error('Error constructing RUNE price from THORNode:', error)
      return Promise.reject(new Error('Failed to construct RUNE price from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'api/runePrice'
  )
}

export function getDailySwap() {
  return $axiosInstace.get(
    INSIGHT_URL + 'ec833986-4bda-4d39-b1c9-7e44094c5e8e/data/latest'
  )
}
