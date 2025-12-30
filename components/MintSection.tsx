'use client'
// 引入 useEffect 和 useState
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import abi from '../abi.json'
import { CONTRACT_ADDRESS } from '@/uilts/index'

// 记得换成你部署好的合约地址
// const CONTRACT_ADDRESS = '0xa15c370A7f354847b25Bf0d566266577FbE4EC64'

export default function MintSection() {
    const { isConnected, address } = useAccount()

    // 读取已铸造数量
    const { data: totalSupply, refetch: refetchSupply } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'totalSupply'
    })

    // 写入合约逻辑
    const { writeContract, data: hash, isPending: isWalletCheck, error: mintError } = useWriteContract()

    // 等待交易确认
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash
    })

    const handleMint = async () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: 'mint',
            value: parseEther('0.001')
        })
    }

    //新增一个 useEffect：监听交易确认状态
    useEffect(() => {
        if (isConfirmed) {
            console.log('交易确认了！正在刷新数据...')
            // 核心动作：重新去链上读一次“现在有多少个NFT”
            refetchSupply()
        }
    }, [isConfirmed, refetchSupply])

    // 读取合约里的 owner 地址
    const { data: ownerAddress } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'owner'
    })
    console.log(ownerAddress)

    // 提款 Hook
    const { writeContract: withdraw } = useWriteContract()

    const handleWithdraw = () => {
        withdraw({
            address: CONTRACT_ADDRESS,
            abi: abi,
            functionName: 'withdraw'
        })
    }
    // 判断当前用户是不是老板
    const isOwner = !!address && !!ownerAddress && address.toLowerCase() === (ownerAddress as string).toLowerCase()
    console.log(isOwner)

    // 1. 新增状态：用来存图片的 URL
    // const [imageUri, setImageUri] = useState<string>('')

    // 2. 读取 Token ID 为 1 的 URI (假设你Mint的是第1个)
    // const { data: tokenUriData } = useReadContract({
    //     address: CONTRACT_ADDRESS,
    //     abi: abi,
    //     functionName: 'tokenURI',
    //     args: [1n] // 读取第1个NFT，注意要用 BigInt 格式
    // })

    // ✅ 1. 定义一个转换 IPFS 链接的工具函数
    // 它可以把 ipfs:// 转换成浏览器能访问的 HTTP 链接
    // const getIpfsUrl = (uri: string) => {
    //     if (!uri) return ''
    //     // 如果已经是 http 开头，直接返回
    //     if (uri.startsWith('http')) return uri
    //     // 如果是 ipfs:// 开头，替换成官方网关
    //     // 既然刚才你试了 ipfs.io 能用，我们就全用它！
    //     return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    // }

    // ✅ 2. 动态请求逻辑
    // useEffect(() => {
    //     const fetchMetadata = async () => {
    //         // 如果合约还没读到数据，先不动
    //         if (!tokenUriData) return

    //         try {
    //             let uriString = tokenUriData as string
    //             console.log('正在请求 Metadata URI:', uriString)

    //             // 🛠️ 关键修复：如果你发现链接以 "1" 结尾，把它切掉！
    //             // 这样就变回了你上传的那个 JSON 文件的正确 CID
    //             // if (uriString.endsWith('1')) {
    //             //     uriString = uriString.slice(0, -1)
    //             // }

    //             // A. 转换 JSON 的下载链接
    //             const metadataUrl = getIpfsUrl(uriString)

    //             // B. 发起请求 (利用浏览器发请求，不再经过后端 API)
    //             const response = await fetch(metadataUrl)

    //             // 如果网络不通，抛出错误
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`)
    //             }

    //             const json = await response.json()
    //             console.log('拿到 JSON 数据了:', json)

    //             // C. 从 JSON 里提取图片链接
    //             if (json.image) {
    //                 // 把 JSON 里的 ipfs:// 图片链接也转换一下
    //                 const imgUrl = getIpfsUrl(json.image)
    //                 setImageUri(imgUrl)
    //             }
    //         } catch (err) {
    //             console.error('动态获取图片失败，请检查控制台网络:', err)
    //             // 如果 ipfs.io 偶尔挂了，这里可以由你手动填个备用的，或者留空
    //         }
    //     }

    //     fetchMetadata()
    // }, [tokenUriData]) // 只要 tokenUriData 变了，我就重新请求

    if (!isConnected) return ''
    return (
        <div className="p-8 border border-gray-700 rounded-2xl bg-gray-900/50 backdrop-blur-sm text-white max-w-md mx-auto shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">铸造 Dev NFT</h2>

            {/* 数据展示面板 */}
            <div className="flex justify-between mb-6 text-gray-300 text-sm bg-gray-800 p-4 rounded-lg">
                <div>
                    <p className="mb-1 text-gray-500">铸造价格</p>
                    <p className="font-mono text-white text-lg">0.001 ETH</p>
                </div>
                <div className="text-right">
                    <p className="mb-1 text-gray-500">当前进度</p>
                    <p className="font-mono text-white text-lg">{totalSupply?.toString() || '0'} 个</p>
                </div>
            </div>

            {/* 按钮区域 */}
            {!isConnected ? (
                <div className="text-center p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-yellow-500">⚠️ 请先点击上方按钮连接钱包</div>
            ) : (
                <button
                    onClick={handleMint}
                    disabled={isWalletCheck || isConfirming}
                    className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all
            ${isWalletCheck || isConfirming ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25 active:scale-95'}
          `}
                >
                    {isWalletCheck ? '等待钱包签名...' : isConfirming ? '正在上链确认中...' : '立即铸造 (Mint)'}
                </button>
            )}

            {isOwner && (
                <div className="mt-8 p-4 border border-yellow-600/50 rounded-xl bg-yellow-900/10">
                    <h3 className="text-yellow-500 font-bold mb-2">👑 管理员面板</h3>
                    <p className="text-sm text-gray-400 mb-3">合约内余额归集</p>
                    <button onClick={handleWithdraw} className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg">
                        提取所有 ETH
                    </button>
                </div>
            )}

            {/* 4. 新增：展示 NFT 图片区域 */}
            {/* {imageUri && (
                <div className="mt-8 p-4 border border-gray-700 rounded-xl bg-black/40 text-center animate-fade-in">
                    <p className="text-gray-400 text-sm mb-3">你的链上资产 (Token #1)</p>
                    <img src={imageUri} alt="My NFT" className="w-full h-auto rounded-lg shadow-2xl border border-gray-600 hover:scale-105 transition-transform duration-300" />
                </div>
            )} */}

            {/* 错误提示 */}
            {mintError && <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">❌ 错误: {mintError.message.includes('User rejected') ? '用户取消了签名' : '交易失败，请检查余额'}</div>}

            {/* 成功提示 */}
            {isConfirmed && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg text-center animate-pulse">
                    <p className="text-green-400 font-bold text-lg mb-2">🎉 铸造成功！</p>
                    <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4">
                        在区块链浏览器查看详情 ↗
                    </a>
                </div>
            )}
        </div>
    )
}
