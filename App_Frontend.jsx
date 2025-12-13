import React, { useState } from "react";


export default function App(){
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
