"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { nftAbi } from "../abi/nftAbi"; // 刚刚建的
import { toast } from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ⚠️ 替换成你刚才在 Remix 部署的合约地址
const NFT_CONTRACT_ADDRESS = "0xf97f971120a6303fe2a607f557b028732d88a798";

export default function NftPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // --- 1. 读取合约数据 ---

  // A. 读取已铸造数量
  const { data: mintedCount, refetch: refetchCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "totalSupply",
  });

  // B. 读取最大总量
  const { data: maxSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "TOTAL_SUPPLY",
  });

  // C. 读取价格
  const { data: price } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "MINT_PRICE",
  });

  // --- 2. 铸造逻辑 ---
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("铸造成功！恭喜你拥有了 NFT 🎉");
      refetchCount(); // 刷新计数器
    }
  }, [isSuccess, refetchCount]);

  const handleMint = () => {
    if (!price) return;

    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: nftAbi,
      functionName: "mint",
      args: [],
      // ⚠️ 关键：铸造 NFT 需要付钱，必须传 value
      // 这里的 price 是合约读出来的 BigInt (1000000000000000)
      value: price,
    });
  };

  if (!mounted) return null;

  // 计算进度条百分比
  const percentage =
    mintedCount && maxSupply
      ? (Number(mintedCount) / Number(maxSupply)) * 100
      : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* 顶部连接按钮 */}
      <div className="absolute top-24 right-4">
        {/* 如果你有全局 Layout 就不需要这行，如果没有就加上 */}
        {/* <ConnectButton /> */}
      </div>

      <div className="w-full max-w-lg bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col md:flex-row">
        {/* 左侧：图片展示区 */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-900 to-indigo-900 p-8 flex items-center justify-center relative">
          {/* 这是一个占位图，实际上你可以放任何图片 */}
          <div className="w-48 h-48 bg-black/30 rounded-xl border-2 border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
            <span className="text-6xl">👻</span>
          </div>
          <div className="absolute bottom-4 text-white/50 text-xs font-mono">
            Blind Box
          </div>
        </div>

        {/* 右侧：操作区 */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Web3 Master</h1>
            <p className="text-zinc-400 text-sm mb-6">
              限量发行 100 枚，持有者可加入核心社区。
            </p>

            {/* 价格标签 */}
            <div className="bg-zinc-800 rounded-lg p-3 mb-4 flex justify-between items-center">
              <span className="text-zinc-400 text-sm">价格</span>
              <span className="text-white font-bold font-mono">
                {price ? formatEther(price) : "..."} ETH
              </span>
            </div>

            {/* 进度条 */}
            <div className="mb-2 flex justify-between text-xs text-zinc-500">
              <span>已铸造</span>
              <span>
                {mintedCount?.toString() || "0"} /{" "}
                {maxSupply?.toString() || "100"}
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleMint}
            disabled={
              isPending || isConfirming || !isConnected || percentage >= 100
            }
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              isPending || isConfirming
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isPending || isConfirming ? "铸造中..." : "立即铸造 (Mint)"}
          </button>
        </div>
      </div>

      {/* 调试信息: 显示合约地址 */}
      <div className="mt-8 text-zinc-600 font-mono text-xs">
        Contract:{" "}
        <a
          href={`https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`}
          target="_blank"
          className="underline hover:text-white"
        >
          {NFT_CONTRACT_ADDRESS.slice(0, 6)}...{NFT_CONTRACT_ADDRESS.slice(-4)}
        </a>
      </div>
    </div>
  );
}
