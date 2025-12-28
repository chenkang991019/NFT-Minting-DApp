import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Web3 Builder
      </h1>

      <div className="border border-gray-800 p-8 rounded-2xl bg-gray-900 shadow-xl flex flex-col items-center gap-4">
        <p className="text-gray-400">Environment Ready 🚀</p>
        <ConnectButton />
      </div>
    </main>
  );
}
