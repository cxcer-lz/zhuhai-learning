"use client";
// pages/usdt-transfers.js
import { useEffect, useState } from 'react';
import { createPublicClient, webSocket, http, parseAbiItem, formatUnits } from 'viem';
const customMainnet = {
  rpcUrls: {
      default: { http: ['https://rpc.mevblocker.io'] },
  },
};

const TransferListener = () => {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transfersPerPage = 50;
  

  useEffect(() => {
    // const client = createPublicClient({
    //   chain: mainnet,
    //   transport: webSocket('wss://ethereum-rpc.publicnode.com'),
    // });
    const client = createPublicClient({
      chain: customMainnet,
      transport: http(),
    });

    const unsubscribe = client.watchBlocks({
      onBlock: async (block) => {
        console.log(block);
        console.log(block.number);
       
        const logs = await client.getLogs({
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
          fromBlock: block.number,
          toBlock: block.number,
        });
        console.log(logs);
        logs.forEach(log => {
          setTransfers(prev => [
            {
              blockNumber: block.number.toString(),
              blockHash: block.hash,
              from: log.args.from,
              to: log.args.to,
              value: formatUnits(log.args.value, 6), // USDT has 6 decimals
            },
            ...prev,
          ]);
        });
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const indexOfLastTransfer = currentPage * transfersPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
  const currentTransfers = transfers.slice(indexOfFirstTransfer, indexOfLastTransfer);

  const paginate = pageNumber => setCurrentPage(pageNumber);
  const formatBlockHash = (hash) => {
    return `${hash.slice(0, 7)}...${hash.slice(-5)}`;
  };

  return (
    <div>
    <h1>Latest USDT Transfers</h1>
    <ul>
      {currentTransfers.map((transfer, index) => (
        <li key={index}>
          在 {transfer.blockNumber} 区块 {formatBlockHash(transfer.blockHash)} 交易中从 {transfer.from} 转账 {transfer.value} USDT 到 {transfer.to}
        </li>
      ))}
    </ul>
    <div>
      {Array.from({ length: Math.ceil(transfers.length / transfersPerPage) }, (_, index) => (
        <button key={index + 1} onClick={() => paginate(index + 1)}>
          第{index + 1}页
        </button>
      ))}
    </div>
  </div>
  );
};

export default TransferListener;
