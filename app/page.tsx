"use client";

import React, { useEffect, useState } from 'react';
import { http, createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { wagmiContract } from './nftcontract';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Helper function to convert ipfs:// URLs to https:// URLs using a public IPFS gateway
function convertIpfsUrl(ipfsUrl) {
  return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

export default function Home() {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [isValidJSON, setIsValidJSON] = useState(true);
  const [inputTokenId, setInputTokenId] = useState(''); // State to store user input
  const [tokenId, setTokenId] = useState(null); // State to store the current tokenId

  const handleInputChange = (event) => {
    setInputTokenId(event.target.value);
  };

  const handleSubmit = () => {
    setTokenId(inputTokenId);
  };

  useEffect(() => {
    if (tokenId === null) return; // Don't fetch data if tokenId is not set

    async function fetchData() {
      try {
        const [name, owner, tokenURI] = await Promise.all([
          client.readContract({
            ...wagmiContract,
            functionName: 'name',
          }),
          client.readContract({
            ...wagmiContract,
            functionName: 'ownerOf',
            args: [Number(tokenId)],
          }),
          client.readContract({
            ...wagmiContract,
            functionName: 'tokenURI',
            args: [Number(tokenId)],
          }),
        ]);
        setName(name);
        setOwner(owner);
        setTokenURI(tokenURI);

        // Convert ipfs:// URL to https:// URL
        const httpTokenURI = convertIpfsUrl(tokenURI);

        // Fetch token data from the token URI
        if (httpTokenURI) {
          const response = await fetch(httpTokenURI);

          // Check if the response is OK and has a JSON content type
          if (!response.ok || !response.headers.get('content-type').includes('application/json')) {
            setIsValidJSON(false);
            throw new Error('Invalid JSON response');
          }

          const data = await response.json();
          console.log('Fetched token data:', data); // Print token data
          setTokenData(data);
          setIsValidJSON(true);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    }
    fetchData();
  }, [tokenId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <input
          type="text"
          value={inputTokenId}
          onChange={handleInputChange}
          placeholder="Enter Token ID"
          className="p-2 border rounded"
          style={{ color: 'black' }}
        />
        <button onClick={handleSubmit} className="p-2 ml-2 bg-blue-500 text-white rounded">
          Get NFT Data
        </button>
      </div>
      <div>
        {`The NFT owner is: ${owner}`}
      </div>
      <div>
        {isValidJSON ? (
          tokenData ? (
            <div>
              <h1>Name:{tokenData['name']}</h1>
              <p>Description:{tokenData['description']}</p>
              <img
                src={convertIpfsUrl(tokenData['image'])} // Convert the image URL to a valid HTTP URL
                alt={tokenData['description']}
                width={200}
                height={200}
              />
              <div>
                <h2>Attributes:</h2>
                <ul>
                  {tokenData['attributes'] && tokenData['attributes'].map((attribute, index) => (
                    <li key={index}>
                      <strong>{attribute.trait_type}:</strong> {attribute.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Loading token data...</p>
          )
        ) : (
          <p>Invalid JSON data from tokenURI</p>
        )}
      </div>
    </main>
  );
}
