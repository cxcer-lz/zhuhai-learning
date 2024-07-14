"use client";

// import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { http, createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { wagmiContract } from './nftcontract';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const address = '0x0483B0DFc6c78062B9E999A82ffb795925381415';

// Helper function to convert ipfs:// URLs to https:// URLs using a public IPFS gateway
function convertIpfsUrl(ipfsUrl) {
  return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

export default function Home() {
  const [name, setName] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [name, tokenId, tokenURI] = await Promise.all([
          client.readContract({
            ...wagmiContract,
            functionName: 'name',
          }),
          client.readContract({
            ...wagmiContract,
            functionName: 'ownerOf',
            args: [BigInt(81)],  // 不需要 Number(81)
          }),
          client.readContract({
            ...wagmiContract,
            functionName: 'tokenURI',
            args: [BigInt(81)],
          }),
        ]);
        setName(name);
        setTokenId(tokenId);
        setTokenURI(tokenURI);

        // Convert ipfs:// URL to https:// URL
        const httpTokenURI = convertIpfsUrl(tokenURI);

        // Fetch token data from the token URI
        if (httpTokenURI) {
          const response = await fetch(httpTokenURI);

          const data = await response.json();
          console.log('Fetched token data:', data);
          setTokenData(data);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {`The NFT owner is: ${tokenId}`}
      </div>
      <div>
        { tokenData ? (
            <div>
              <h1>{tokenData['name']}</h1>
      
              <p>{tokenData['description']}</p>
            
              {/* <p>{convertIpfsUrl(tokenData['image'])}</p> */}
              <Image src={convertIpfsUrl(tokenData['image'])} alt={tokenData['name']} width={200} height={200} />
            </div>
          ) : (
            <p>Loading token data...</p>
          )
        }
      </div>
    </main>
  );
}
