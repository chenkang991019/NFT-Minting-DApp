import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'cb4d11f64e1d082ff0754a462235ab49'

export const config = getDefaultConfig({
    appName: 'NFT Minting DApp',
    projectId: projectId,
    chains: [mainnet, sepolia],
    ssr: true, // 开启服务端渲染支持
    transports: {
        [mainnet.id]: http(),
        // 使用环境变量里的 RPC，如果没有就用默认的
        [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.zan.top/eth-sepolia')
    }
})
