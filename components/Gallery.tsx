'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import abi from '../abi.json'

import { CONTRACT_ADDRESS } from '@/uilts/index'
// 1. 找一张“盲盒/问号”图片的链接作为默认图
const MYSTERY_BOX_IMAGE = 'https://placehold.co/400x400/1e293b/FFF?text=Mystery+Box'
// 定义一个接口，方便管理数据
interface MyNFT {
    id: number
    image: string
    name: string
}

export default function Gallery() {
    const { address } = useAccount()
    const publicClient = usePublicClient() // 获取 Viem 客户端，用于手动调用合约

    const [nfts, setNfts] = useState<MyNFT[]>([])
    const [loading, setLoading] = useState(false)

    // 1. 读取总供应量 (一共铸造了多少个)
    const { data: totalSupplyData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'totalSupply'
    })

    // 工具函数：处理 IPFS 链接
    const getIpfsUrl = (uri: string) => {
        if (!uri) return ''
        // 修复那个 "1" 的 bug
        // if (uri.endsWith('1')) uri = uri.slice(0, -1)

        if (uri.startsWith('http')) return uri
        return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    // 2. 核心逻辑：遍历链上数据
    useEffect(() => {
        const fetchMyNFTs = async () => {
            // 没连钱包、或者不知道总数时，不执行
            if (!address || !publicClient || !totalSupplyData) return

            setLoading(true)
            const total = Number(totalSupplyData)
            const myTokens: MyNFT[] = []

            console.log(`开始遍历 ${total} 个 NFT...`)

            // ⚠️ 简单粗暴法：循环遍历所有 ID
            // (注意：生产环境如果有一万个，这样做会卡死，需要用 TheGraph 或 Alchemy API)
            for (let i = 1; i <= total; i++) {
                try {
                    // A. 查主人
                    const owner = (await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: abi,
                        functionName: 'ownerOf',
                        args: [BigInt(i)]
                    })) as string

                    if (owner.toLowerCase() === address.toLowerCase()) {
                        let tokenURI = (await publicClient.readContract({
                            address: CONTRACT_ADDRESS,
                            abi: abi,
                            functionName: 'tokenURI',
                            args: [BigInt(i)]
                        })) as string

                        // 这里不需要正则砍数字了，因为现在是文件夹模式，/6 是合理的路径，只是文件不存在

                        // B. 请求 Metadata
                        const httpUri = getIpfsUrl(tokenURI).replace('ipfs://', 'https://ipfs.io/ipfs/')

                        let name = `Dev NFT #${i}`
                        let image = MYSTERY_BOX_IMAGE // 默认先设为盲盒图

                        try {
                            // 尝试请求 IPFS 数据
                            const response = await fetch(httpUri)

                            if (response.ok) {
                                // ✅ 如果请求成功 (文件存在)
                                const metadata = await response.json()
                                name = metadata.name || name
                                if (metadata.image) {
                                    image = getIpfsUrl(metadata.image).replace('ipfs://', 'https://ipfs.io/ipfs/')
                                }
                            } else {
                                // ❌ 如果请求失败 (比如 404 没找到文件 #6)
                                console.warn(`Token #${i} 的 Metadata 还没上传`)
                                // 这里不做任何事，变量 image 保持为默认的盲盒图
                            }
                        } catch (networkError) {
                            console.warn(`Token #${i} 网络请求失败，显示默认图`)
                        }

                        // C. 无论有没有 Metadata，都把这个 NFT 展示出来
                        // 这样用户知道自己买了 #6，只是还没开图
                        myTokens.push({
                            id: i,
                            name: name,
                            image: image
                        })
                    }
                } catch (err) {
                    console.error(`查询链上数据失败 ID ${i}`, err)
                }
            }

            setNfts(myTokens)
            setLoading(false)
        }

        fetchMyNFTs()
    }, [address, totalSupplyData, publicClient])

    if (!address) return null

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">我的 NFT 收藏 ({nfts.length})</h2>

            {loading && <div className="text-center text-blue-400 py-10 animate-pulse">正在链上搜寻你的资产... (请稍候)</div>}

            {!loading && nfts.length === 0 && <div className="text-gray-500 text-center py-10">你还没有铸造任何 NFT，快去上面铸造一个吧！</div>}

            {/* Grid 布局展示图片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                    <div key={nft.id} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/50 transition-all">
                        <div className="aspect-square w-full overflow-hidden relative">
                            <img src={nft.image} alt={nft.name} className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">#{nft.id}</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white">{nft.name}</h3>
                            <p className="text-gray-400 text-xs mt-1">Dev NFT Collection</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
