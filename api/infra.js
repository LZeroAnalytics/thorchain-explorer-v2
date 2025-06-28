import endpoints from './endpoints'
// axios instance
import { $axiosInstace } from './index'

export async function getTHORLastBlock() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const blockRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/lastblock/thorchain'
      )
      return { data: blockRes.data }
    } catch (error) {
      console.error('Error fetching last block from THORNode:', error)
      return Promise.reject(new Error('Failed to fetch last block from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'lastblock'
  )
}

export async function getBlockHeight(height) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const blockRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].TENDERMINT_URL + `block?height=${height}`
      )
      return { data: blockRes.data }
    } catch (error) {
      console.error('Error fetching block from Tendermint:', error)
      return Promise.reject(new Error('Failed to fetch block from Tendermint RPC'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + `block?height=${height}`
  )
}

export async function getQuote(params) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const quoteRes = await $axiosInstace.get(
        endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/quote/swap',
        { params }
      )
      return { data: quoteRes.data }
    } catch (error) {
      console.error('Error fetching quote from THORNode:', error)
      return Promise.reject(new Error('Failed to fetch quote from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'quote',
    {
      params,
    }
  )
}

export async function getChurn() {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const nodesRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/nodes')
      const nodes = nodesRes.data
      
      const churns = nodes.filter(node => node.status === 'Standby' || node.status === 'Ready').map(node => ({
        height: node.status_since || 0,
        time: new Date().toISOString(),
        node_address: node.node_address,
        status: node.status
      }))

      return { data: churns }
    } catch (error) {
      console.error('Error constructing churn data from THORNode:', error)
      return Promise.reject(new Error('Failed to construct churn data from THORNode API'))
    }
  }
  return $axiosInstace.get(endpoints[process.env.NETWORK].SERVER_URL + 'churns')
}

export async function getInfraEarnings(params) {
  if (!endpoints[process.env.NETWORK].SERVER_URL) {
    try {
      const networkRes = await $axiosInstace.get(endpoints[process.env.NETWORK].THORNODE_URL + 'thorchain/network')
      const network = networkRes.data

      const earnings = {
        liquidityEarnings: network.liquidity_earnings_24h || '0',
        blockRewards: network.block_rewards_24h || '0',
        earnings: network.earnings_24h || '0',
        bondingEarnings: network.bonding_earnings_24h || '0',
        liquidityFees: network.liquidity_fees_24h || '0'
      }

      return { data: earnings }
    } catch (error) {
      console.error('Error constructing earnings from THORNode:', error)
      return Promise.reject(new Error('Failed to construct earnings from THORNode API'))
    }
  }
  return $axiosInstace.get(
    endpoints[process.env.NETWORK].SERVER_URL + 'earnings',
    {
      params,
    }
  )
}
