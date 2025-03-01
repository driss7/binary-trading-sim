import React, { useState } from "react";

const BinaryTradingApp = () => {
    const [balance, setBalance] = useState(0);
    const [returnPercentage, setReturnPercentage] = useState(85);
    const [tradeAmount, setTradeAmount] = useState(10);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [instrument, setInstrument] = useState("EUR/USD");
    const [amount, setAmount] = useState(1000);
    const [transactionHistory, setTransactionHistory] = useState([]);

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
                        returnAmount: isWinner ? trade.returnAmount : null
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

    const handleDeposit = () => {
        if (amount > 0) {
            setBalance(balance + amount);
            setTransactionHistory([{ id: transactionHistory.length + 1, type: "Deposit", amount }, ...transactionHistory]);
            setAmount(0);
        }
    };

    const handleWithdrawal = () => {
        if (amount > 0 && balance >= amount) {
            setBalance(balance - amount);
            setTransactionHistory([{ id: transactionHistory.length + 1, type: "Withdrawal", amount }, ...transactionHistory]);
            setAmount(0);
        }
    };

    const totalTrades = tradeHistory.length;
    const wins = tradeHistory.filter((trade) => trade.status === "won").length;
    const losses = tradeHistory.filter((trade) => trade.status === "lost").length;
    const winPercentage = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0;
    const profitFactor = losses > 0 ? (wins / losses).toFixed(2) : wins > 0 ? "∞" : "0";
    const totalProfit = tradeHistory.reduce((acc, trade) => acc + (trade.profit || 0), 0).toFixed(2);

    const tradeDisabled = tradeAmount > balance;

    console.log(tradeHistory);
    return (
        <div className="text-center p-8 font-sans bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold">Driss Binary Trading Sim</h2>
            <div className="mt-4">
                <label className="block">Account Balance:
                    <input type="text" value={`$${balance}`} disabled className="border p-1 ml-2 font-bold" />
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

            <h3 className="text-xl font-bold mt-6">Deposit & Withdrawal</h3>
            <div className="mt-2">
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2" />
                <button onClick={handleDeposit} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Deposit</button>
                <button onClick={handleWithdrawal} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Withdraw</button>
            </div>

            <div className="mt-12 mb-12">
                <button onClick={() => handleTrade("up")} disabled={tradeDisabled} className={
                    `bg-green-500 text-white px-12 py-2 rounded mr-2 ${tradeDisabled ? "opacity-50 cursor-not-allowed" : ""}`
                }>Up</button>
                <button onClick={() => handleTrade("down")} disabled={tradeDisabled} className={
                    `bg-red-500 text-white px-12 py-2 rounded ${tradeDisabled ? "opacity-50 cursor-not-allowed" : ""}`
                }>Down</button>
            </div>


            <h3 className="text-xl font-bold mt-24">Trade History</h3>
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
                            <td className="border p-2">
                            {
                                trade.returnAmount > 0 ? `$${trade.returnAmount.toFixed(2)}` :`-$${trade.tradeAmount.toFixed(2)}`
                            }

                            </td>
                            <td className="border p-2">{trade.status}</td>
                            <td className="border p-2">
                                {trade.status === "pending" && (
                                    <>
                                        <button onClick={() => updateTradeStatus(trade.id, true)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Won</button>
                                        <button onClick={() => updateTradeStatus(trade.id, false)} className="bg-red-500 text-white px-3 py-1 rounded">Lost</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className="text-xl font-bold mt-24">Trading Statistics</h3>
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
            <h3 className="text-xl font-bold mt-24">Transaction History</h3>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactionHistory.map((transaction) => (
                        <tr key={transaction.id} className="text-center">
                            <td className="border p-2">{transaction.id}</td>
                            <td className="border p-2">{transaction.type}</td>
                            <td className="border p-2">${transaction.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BinaryTradingApp;
