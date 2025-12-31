import { ConnectButton } from '@rainbow-me/rainbowkit'
import MintSection from '../components/MintSection'
import Gallery from '../components/Gallery'

export default function Home() {
    return (
        // 1. 这里的 min-h-screen 保证全屏
        // 2. bg-slate-950 是极深的蓝黑色
        // 3. 加上 radial-gradient 做一点顶部的极光效果
        <main className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 text-white selection:bg-indigo-500/30">
            {/* 顶部导航栏 */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg animate-pulse"></div>
                    <h1 className="text-xl font-bold tracking-tighter">
                        DevNFT <span className="text-indigo-400">Studio</span>
                    </h1>
                </div>
                <ConnectButton />
            </nav>

            {/* 内容区域：限制最大宽度，居中 */}
            <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
                {/* 头部文案 */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">铸造你的链上资产</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        基于 ERC-721 标准的去中心化 NFT 发行平台。
                        <br className="hidden md:block" />
                        连接钱包，即刻拥有独一无二的数字藏品。
                    </p>
                </div>

                {/* 核心组件区域 - 去掉了白底，让它们自然融入背景 */}
                <div className="grid gap-12">
                    <MintSection />
                    <Gallery />
                </div>
            </div>

            {/* 底部版权 */}
            <footer className="py-8 text-center text-slate-600 text-sm">© 2024 DevNFT Project. Powered by Next.js & Ethereum.</footer>
        </main>
    )
}
