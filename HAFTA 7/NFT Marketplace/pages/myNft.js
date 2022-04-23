import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    // console.log('1. web3Modal-------------success', web3Modal)

    let connection = null
    try {
      connection = await web3Modal.connect()
      // console.log('2.1. connection-------------success', connection)
    } catch (error) {
      // console.log('2.2. connection-------------error', error)
      return toast.error(error || 'Error web3Modal.connect')
    }

    const provider = new ethers.providers.Web3Provider(connection)
    // console.log('3. provider-------------success', provider)

    const signer = provider.getSigner()
    // console.log('4. signer-------------success', signer)


    // console.log('5.01. marketplaceAddress, NFTMarketplace.abi, signer----', marketplaceAddress, NFTMarketplace.abi, signer)
    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    // console.log('5.2. marketplaceContract----------Success', marketplaceContract)

    let data = null
    try {
      data = await marketplaceContract.fetchMyNFTs()
      // console.log('6.1. marketplaceContract.fetchMyNFTs-------------success', data)
    } catch (error) {
      // console.log('6.2. marketplaceContract.fetchMyNFTs-------------error', error)
      return toast.error(error || 'Error marketplaceContract.fetchMyNFTs')
    }

    try {
      const items = await Promise.all(data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded')
      // console.log('7.1. get NFT List-----------Success', items)
    } catch (error) {
      // console.log('7.2. Error get NFT List-----------', error)
      setLoadingState('loaded')
      return toast.error(error || 'Error get NFT List')
    }
  }

  function listNFT(nft) {
    // console.log('nft:', nft)
    router.push(`/nft-demo/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}