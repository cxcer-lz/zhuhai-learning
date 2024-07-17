'use client'

import { createConfig, cookieStorage, createStorage, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import styles from './page.module.css'
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useDisconnect } from "wagmi"

export default function Home() {
  return (
    <main className={styles.main}>
      <w3m-button />
    </main>
  )
}