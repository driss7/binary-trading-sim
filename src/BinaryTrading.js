import React, { useState } from "react";

const BinaryTradingApp = () => {
    const [balance, setBalance] = useState(1000);
    const [returnPercentage, setReturnPercentage] = useState(90);
    const [tradeAmount, setTradeAmount] = useState(10);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [instrument, setInstrument] = useState("EUR/USD");

    const handleTrade = (direction) => {
        const newTrade = {
            id: tradeHistory.length + 1,
            instrument,
            direction,
            tradeAmount,
            returnAmount: tradeAmount * (1 + returnPercentage / 100),
            status: "pending",
        };
        setTradeHistory([newTrade, ...tradeHistory]);
    };

    const updateTradeStatus = (id, isWinner) => {
        setTradeHistory((prevHistory) =>
            prevHistory.map((trade) =>
                trade.id === id
                    ? {
                        ...trade,
                        status: isWinner ? "won" : "lost",
                        profit: isWinner ? trade.returnAmount - trade.tradeAmount : -trade.tradeAmount,
                    }
                    : trade
            )
        );

        setBalance((prevBalance) =>
            tradeHistory.find((trade) => trade.id === id)?.status === "pending"
                ? prevBalance + (isWinner ? tradeHistory.find((trade) => trade.id === id).returnAmount - tradeAmount : -tradeAmount)
                : prevBalance
        );
    };

    const totalTrades = tradeHistory.length;
    const wins = tradeHistory.filter((trade) => trade.status === "won").length;
    const losses = tradeHistory.filter((trade) => trade.status === "lost").length;
    const winPercentage = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0;
    const profitFactor = losses > 0 ? (wins / losses).toFixed(2) : wins > 0 ? "∞" : "0";
    const totalProfit = tradeHistory.reduce((acc, trade) => acc + (trade.profit || 0), 0).toFixed(2);

    return (
        <div className="text-center p-8 font-sans bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold">Binary Trading App</h2>
            <div className="mt-4">
                <label className="block">Account Balance: $
                    <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="border p-2 ml-2" />
                </label>
                <label className="block mt-2">Trading Instrument:
                    <input type="text" value={instrument} onChange={(e) => setInstrument(e.target.value)} className="border p-2 ml-2" />
                </label>
                <label className="block mt-2">Return per Trade (%):
                    <input type="number" value={returnPercentage} onChange={(e) => setReturnPercentage(Number(e.target.value))} className="border p-2 ml-2" />
                </label>
                <label className="block mt-2">Trade Amount ($):
                    <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(Number(e.target.value))} className="border p-2 ml-2" />
                </label>
            </div>
            <div className="mt-4">
                <button onClick={() => handleTrade("up")} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Up</button>
                <button onClick={() => handleTrade("down")} className="bg-red-500 text-white px-4 py-2 rounded">Down</button>
            </div>
            <h3 className="text-xl font-bold mt-6">Trade History</h3>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Instrument</th>
                        <th className="border p-2">Direction</th>
                        <th className="border p-2">Trade Amount</th>
                        <th className="border p-2">Return Amount</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tradeHistory.map((trade) => (
                        <tr key={trade.id} className="text-center">
                            <td className="border p-2">{trade.id}</td>
                            <td className="border p-2">{trade.instrument}</td>
                            <td className="border p-2">{trade.direction}</td>
                            <td className="border p-2">${trade.tradeAmount.toFixed(2)}</td>
                            <td className="border p-2">${trade.returnAmount.toFixed(2)}</td>
                            <td className="border p-2">{trade.status}</td>
                            <td className="border p-2">
                                {trade.status === "pending" && (
                                    <>
                                        <button onClick={() => updateTradeStatus(trade.id, true)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Win</button>
                                        <button onClick={() => updateTradeStatus(trade.id, false)} className="bg-gray-500 text-white px-3 py-1 rounded">Lose</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className="text-xl font-bold mt-6">Trading Statistics</h3>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Total Trades</th>
                        <th className="border p-2">Wins</th>
                        <th className="border p-2">Losses</th>
                        <th className="border p-2">Win Percentage</th>
                        <th className="border p-2">Profit Factor</th>
                        <th className="border p-2">Total Profit/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-center">
                        <td className="border p-2">{totalTrades}</td>
                        <td className="border p-2">{wins}</td>
                        <td className="border p-2">{losses}</td>
                        <td className="border p-2">{winPercentage}%</td>
                        <td className="border p-2">{profitFactor}</td>
                        <td className={`border p-2 ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>${totalProfit}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BinaryTradingApp;
