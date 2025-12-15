import React, { useState } from "react";


export default function App_Frontend(){
    const [stateValue, setStateValue] = useState('TX');
    const [income, setIncome] = useState('75000');
    const [mortgage, setMortgage] = useState('30yr_fixed');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    console.log("API_URL =", API_URL);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null); setResult(null);
        try{
            const res = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ state: stateValue, beds: Number(beds), sqft: Number(sqft) })
            });
        if(!res.ok){
            const text = await res.text();
            throw new Error(text || 'Request failed');
        }
    const json = await res.json();
    setResult(json);
    }catch(err){
        setError(err.message || String(err));
        }
    finally{ setLoading(false); }
}
return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Housing Price Predictor</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">State</label>
                    <input value={stateValue} onChange={e=>setStateValue(e.target.value)} className="mt-1 block w-full rounded-md border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Number of Beds</label>
                        <input
                        type="number"
                        value={beds}
                        onChange={e=>setBeds(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium"> Square feet Size</label>
                        <input
                        type="number"
                        value={sqft}
                        onChange={e=>setSqft(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2" />
                    </div>
                    <div>
                        <button disabled={loading} className="w-full py-2 rounded-xl bg-sky-600 text-white font-semibold">{loading? 'Predicting...':'Predict Price Range'}</button>
                    </div>
            </form>
            {error && <div className="mt-4 text-red-600">Error: {error}</div>}
            {result && (
                <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <div className="text-sm text-gray-600">Predicted mean price</div>
                    <div className="text-2xl font-bold">${Number(result.predicted_mean).toLocaleString()}</div>
                    <div className="text-sm mt-2">Range: ${Number(result.lower_bound).toLocaleString()} — ${Number(result.upper_bound).toLocaleString()}
                </div>
            </div>
            )}
        </div>
    </div>
    )
}
