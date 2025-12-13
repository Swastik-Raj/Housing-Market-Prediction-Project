import React, { useState } from "react";


export default function App(){
    const [stateValue, setStateValue] = useState('TX');
    const [income, setIncome] = useState('75000');
    const [mortgage, setMortgage] = useState('30yr_fixed');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);