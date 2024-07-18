"use client";
import { useEffect, useState } from 'react';
import { createPublicClient, webSocket, mainnet } from 'viem';

const BlockListener = () => {
  const [blockData, setBlockData] = useState({ number: null, hash: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createPublicClient({
      chain: mainnet,
      transport: webSocket('wss://ethereum-rpc.publicnode.com'),
    });

    const unsubscribe = client.watchBlocks({
      onBlock: (block) => {
        console.log("New block received:", block); // Debugging line
        setBlockData({ number: block.number.toString(), hash: block.hash });
        setLoading(false);
        // console.log(block.number);
        // console.log(block.hash);
      },
    });

    return () => {
      unsubscribe();
    };
  }, [blockData]);

  useEffect(() => {
    if (blockData.number !== null) {
      console.log("Block data updated:", blockData); // Debugging line
    }
  }, [blockData]);

  return (
    <div>
      <h1>Latest Block Info</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Block Number: {blockData.number}</p>
          <p>Block Hash: {blockData.hash}</p>
        </div>
      )}
    </div>
  );
};

export default BlockListener;
