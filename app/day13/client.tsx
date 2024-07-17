"use client";

import React, { useEffect, useState } from 'react';
import { parseAbiItem } from 'viem';
import { createPublicClient, http } from 'viem';

const customMainnet = {
    rpcUrls: {
        default: { http: ['https://eth-pokt.nodies.app'] },
    },
};


const publicClient = createPublicClient({
    chain: customMainnet,
    transport: http(),
});

export default function Home() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Create event filter
                // const latestBlockNumber = await publicClient.getBlockNumber();
                const latestBlockNumber = 20324502n;
                // const startBlockNumber = latestBlockNumber - 99;
                const startBlockNumber =20324302n;
                const filter = await publicClient.createEventFilter({
                    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
                    fromBlock: startBlockNumber, 
                    toBlock: latestBlockNumber
                });
                console.log("Filter created:", filter);

                // Fetch logs using the created filter
                const logs = await publicClient.getFilterLogs({ filter: filter });
                console.log("Logs fetched:", logs);

                if (logs && logs.length > 0) {
                    console.log("Log details:", logs.map(log => ({
                        from: log.args.from,
                        to: log.args.to,
                        value: log.args.value.toString()
                    })));
                } else {
                    console.log("No logs found for the filter.");
                }

                setLogs(logs);
            } catch (error) {
                console.error("Error fetching logs:", error);
                setError(error.message);
            }
        }

        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                {error && <p>Error: {error}</p>}
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <div key={index}>
                            <p>From: {log.args.from}</p>
                            <p>To: {log.args.to}</p>
                            <p>Value: {log.args.value.toString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No logs found</p>
                )}
            </div>
        </main>
    );
}
