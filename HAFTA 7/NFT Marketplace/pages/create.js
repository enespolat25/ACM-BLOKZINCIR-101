import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { toast } from 'react-toastify'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState('')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  const client = ipfsHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', apiPath: 'api/v0' })

  // convert image to URL
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        // {
        //     progress: (prog) => //console.log(`received: ${prog}`)
        // }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      //console.log('Error uploading file: ', error)
      toast.error(error || 'Error on Onchange File')
    }
  }

  // upload to ipfs and return ipfs url
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      //console.log('Error uploading file: ', error)
      toast.error(error || 'Error on uploadToIPFS')
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    //console.log('1. uploadToIPFS Success------', url)
    const web3Modal = new Web3Modal()
    //console.log('2. Web3Modal------', web3Modal)
    let connection = null
    try {
      connection = await web3Modal.connect()
      //console.log('3.1. connection------success', connection)
    } catch (error) {
      //console.log('3.2. connection------failed', error)
      toast.error(error || 'Error on web3Modal Connect')
    }

    if (!connection) return
    const provider = new ethers.providers.Web3Provider(connection)
    //console.log('4. Provider ------success', provider)
    const signer = provider.getSigner()
    //console.log('5. signer ------success', signer)


    /* next, create the item */
    if (!formInput.price) return toast.error('Please enter price')
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    //console.log('6. price ------success', price)
    //console.log('00.7. marketplaceAddress ------NFTMarketplace.abi, ---signer', marketplaceAddress, NFTMarketplace.abi, signer)

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    )
    //console.log('7. contract ------success', contract)

    let listingPrice = null
    try {
      listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      //console.log('8.1. listingPrice------success', listingPrice)
    } catch (error) {
      //console.log('8.2. listingPrice------error', error)
      toast.error(error || 'Error on getListingPrice')
    }
    if (!listingPrice) return


    let transaction = null
    try {
      transaction = await contract.createToken(url, price, { value: listingPrice })
      //console.log('9.1. contract.createToken------success', transaction)
    } catch (error) {
      //console.log('9.2. contract.createToken------error', error)
      toast.error(error?.data?.message || 'Error while creating token')
    }

    if (!transaction) return
    try {
      await transaction.wait()
      //console.log('10.1 transaction.wait------success')
    } catch (error) {
      //console.log('10.2 transaction.wait------error', error)
      toast.error(error || 'Error while transaction.wait')
    }

    //console.log(transaction);

  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="p-4 w-80 rounded"
          onChange={onChange}
        />
        {
          fileUrl && (
            <div className="text-black">File Url: {fileUrl}</div>
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-gray-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}