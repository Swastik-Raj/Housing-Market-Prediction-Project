import React, { useState } from "react";


export default function App_Frontend(){
    const [stateValue, setStateValue] = useState('TX');
    const [income, setIncome] = useState('75000');
    const [mortgage, setMortgage] = useState('30yr_fixed');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null); setResult(null);
        try{
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ state: stateValue, income: Number(income), mortgage_type: mortgage })
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
                        <label className="block text-sm font-medium">Annual Income (USD)</label>
                        <input
                        type="number"
                        value={income}
                        onChange={e=>setIncome(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mortgage Choice</label>
                        <select value={mortgage} onChange={e=>setMortgage(e.target.value)} className="mt-1 block w-full rounded-md border p-2">
                            <option value="30yr_fixed">30-year fixed</option>
                            <option value="15yr_fixed">15-year fixed</option>
                            <option value="adjustable">Adjustable</option>
                        </select>
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

