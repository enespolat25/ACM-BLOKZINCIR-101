import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

  /*
  *  map over items returned from smart contract and format 
  *  them as well as fetch their token metadata
  */
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    //console.log('1.1. provider------Success', provider)

    //console.log('1.02. marketplaceAddress, NFTMarketplace.abi, provider----', marketplaceAddress, NFTMarketplace.abi, provider)
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    //console.log('1.2. contract------Success', contract)

    let data = null
    try {
      data = await contract.fetchMarketItems()
      //console.log('2.1. contract.fetchMarketItems------Success', data)
    } catch (error) {
      //console.log('2.2. contract.fetchMarketItems------failed', error)
      return toast.error(error || 'Error contract.fetchMarketItems')
    }

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
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
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded')
      //console.log('3.1. get NFT List-----------Success', items)
    } catch (error) {
      //console.log('3.2. Error get NFT List-----------', error)
      setLoadingState('loaded')
      return toast.error(error || 'Error get NFT List')
    }
  }


  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()

    let connection = null
    try {
      connection = await web3Modal.connect()
      //console.log('1.1. Connection-----------Success', connection)
    } catch (error) {
      //console.log('1.2. Connection-----------Error', error)
      return toast.error(error || 'Error Connection')
    }

    const provider = new ethers.providers.Web3Provider(connection)
    //console.log('2. provider-----------Success', provider)

    const signer = provider.getSigner()
    //console.log('3. signer-----------Success', signer)

    //console.log('4.01. marketplaceAddress, NFTMarketplace.abi, signer----', marketplaceAddress, NFTMarketplace.abi, signer)
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    //console.log('4.2. contract------Success', contract)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    //console.log('5. price------Success', price)

    let transaction = null
    try {
      transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })
      //console.log('6.1. transaction-----------Success', transaction)
    } catch (error) {
      //console.log('6.2. transaction-----------Error', error)
      return toast.error(error || 'Error transaction')
    }

    try {
      await transaction.wait()
      loadNFTs()
      //console.log('7.1. transaction.wait-----------Success', transaction)
    } catch (error) {
      //console.log('7.2. transaction.wait-----------Error', error)
      return toast.error(error || 'Error transaction.wait')
    }
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}