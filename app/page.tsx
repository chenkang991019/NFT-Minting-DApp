import { ConnectButton } from '@rainbow-me/rainbowkit'
import MintSection from '../components/MintSection'
import Gallery from '../components/Gallery'

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-black">
            <div className="mb-10">
                {/* RainbowKit 提供的现成连接按钮 */}
                <ConnectButton />
            </div>

            <MintSection />
            <Gallery />
        </main>
    )
}
