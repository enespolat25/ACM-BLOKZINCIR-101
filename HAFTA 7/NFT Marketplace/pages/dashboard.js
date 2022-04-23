import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    //console.log('1. web3Modal------success', web3Modal)

    let connection = null
    try {
      connection = await web3Modal.connect()
      //console.log('2.1. connection------success', connection)
    } catch (error) {
      //console.log('2.2. connection------failed', error)
      return toast.error(error || 'Error on web3Modal Connect')
    }

    const provider = new ethers.providers.Web3Provider(connection)
    //console.log('3. Provider ------success', provider)
    const signer = provider.getSigner()
    //console.log('4. signer ------success', signer)

    //console.log('005. marketplaceAddress ------NFTMarketplace.abi, ---signer', marketplaceAddress, NFTMarketplace.abi, signer)
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    //console.log('5. contract ------success', contract)

    let data = null
    try {
      data = await contract.fetchItemsListed()
      //console.log('6.1. contract fetchItemsListed------success', data)
    } catch (error) {
      //console.log('6.1. contract fetchItemsListed------success', error)
      return toast.error(error || 'Error contract fetchItemsListed')
    }

    try {
      const items = await Promise.all(data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
      }))
      //console.log('7.1. get Token List-----------Success', items)
      setNfts(items)
      setLoadingState('loaded')
    } catch (error) {
      //console.log('7.2. Error get List-----------', error)
      setLoadingState('loaded')
      return toast.error(error || 'Error get List')
    }
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className="text-xl p-4 w-96 my-10 mx-auto">No NFTs listed</h1>
  )
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}