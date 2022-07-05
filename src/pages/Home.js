import { ethers, Signer } from 'ethers';
import { useBalance, useAccount, useContract, useContractEvent, useProvider, useSigner } from "wagmi";
import React, { useEffect, useState } from 'react'
import TokenList from '../components/TokenList'
import * as qs from 'qs'
import About from '../components/About'
/**
 * 
 * @returns
 */
const Home = () => {
    const [tokenList0Open, setTokenList0Open] = useState(false);
    const [tokenList1Open, setTokenList1Open] = useState(false);
    const [token0Address, setToken0Address] = useState();
    const [token0Name, setToken0Name] = useState();
    const [token1Address, setToken1Address] = useState();
    const [token1Name, setToken1Name] = useState();
    const [allowanceTarget, setAllowanceTarget] = useState(); // ref to the token0 contract

    const [token0Balance, setToken0Balance] = useState(0);
    const [token0Amount, setToken0Amount] = useState(0);
    const [token1Amount, setToken1Amount] = useState(0);
    const [gasPrice, setGasPrice] = useState();
    const [swapFee, setSwapFee] = useState();

    // standard erc20 token abi
    const erc20abi = [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
    // gets a reference to the defualt signer / provider, the account to which 
    // MetaMask has logged in.
    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    const provider = useProvider();

    const showTokenList0 = () => {
        setTokenList0Open(true);
    }

    const showTokenList1= () => {
        setTokenList1Open(true);
    }

    const setPercentOfOwned = (percent) => {

    }

    /**
     * This is for testing purpsoes. Normally we start and stop the wave animation
     * to indicate a transaction is processing, but since I want people to be able to see 
     * things without spending ETH, let's do it this way.
     */
    const slowDownWaves = () => {
        let toDecriment = window.$wave_speed / 10;
        for(let i=0; i<10; i++) {
            // create a slight speed-ramp down to the slow down isn't visually jarring
            setTimeout(() => {  window.$wave_speed -= toDecriment; }, 400);
        }
    }

    /**
     * This is for testing purpsoes. Normally we start and stop the wave animation
     * to indicate a transaction is processing, but since I want people to be able to see 
     * things without spending ETH, let's do it this way.
     */
    const speedUpWaves = () => {
        // window.$wave_speed *= 10; 
        let curSpeed = window.$wave_speed;
        // just fyi, no speed ramp here as it just doesn't seem necessary
        for(let i=0; i<10; i++) window.$wave_speed += curSpeed;
    }

    /**
     * 
     * Interacts with the 0x API to get the amount of token1 returned when 
     * swapping token0Amount of token0Address for token1Address
     */
    const getPrice = async () => {
        // if user puts in number of tokens before chossing tokens, don't wate time computing
        if( !token0Address || !token1Address) return;

        let amount = token0Amount;
        amount = ethers.utils.parseEther(amount);

        // set query params. 
        // NOTE! you have to call toString() on amount because it's a BigNumber
        // I spent like an hour trying to debug that one. Writing a long-ass 
        // comment here so I (hopefully) remember in the future.
        const params = {
            sellToken: token0Address,
            buyToken: token1Address,
            sellAmount: amount.toString()
        }

        // fetch the swap price and gas price
        const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
        let swapPriceJSON = await response.json();
        setToken1Amount(ethers.utils.formatEther(swapPriceJSON.buyAmount));
        setGasPrice(swapPriceJSON.estimatedGas);
        setSwapFee(swapPriceJSON.protocolFee);
        setAllowanceTarget(swapPriceJSON.allowanceTarget);
    }

    /**
     * 
     * Interacts with the 0x API to get the amount of token1 returned when 
     * swapping token0Amount of token0Address for token1Address
     */
    const getQuote = async () => {
        // if user puts in number of tokens before chossing tokens, don't wate time computing
        if( !token0Address || !token1Address) return;
        
        // if MetaMask isn't logged in, show error and return
        if(!signer) {
            // TODO error
            return;
        }
        
        // get user inputed value
        let amount = token0Amount;
        // format it because Solidity doesn't deal with floating point numbers
        amount = ethers.utils.parseEther(amount);

        // set query params. 
        // NOTE! you have to call toString() on amount because it's a BigNumber
        // I spent like an hour trying to debug that one. Writing a long-ass 
        // comment here so I (hopefully) remember in the future.
        const params = {
            sellToken: token0Address,
            buyToken: token1Address,
            sellAmount: amount.toString(),
            takerAddress: signer._address // logged in address with MetaMask
        }

        // fetch the swap price and gas price
        const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
        let swapQuoteJSON = await response.json();
        return swapQuoteJSON;
    }

    const trySwap = async () => {
        // start the animation
        speedUpWaves();

        // if user puts in number of tokens before chossing tokens, don't wate time computing
        if( !token0Address || !token1Address) {
            // TODO ERROR
            return;
        }
        // if MetaMask isn't logged in, show error and return
        if(!signer) {
            // TODO error
            return;
        }   

        if(!allowanceTarget) {
            getQuote();
        }

        console.log("allowance target ", allowanceTarget);
        // get a refernce to the contract using ethers
        // note, we can't use the wagmi React hooks here as we're in a function
        const contract = new ethers.Contract(token0Address, erc20abi, signer);
        //const amountToApprove = ethers.utils.parseEther(token0Amount);

        // approve access
        // use the top line to approve max or the second line to apporve just the amount requested
        const amountToApprove = ethers.constants.MaxUint256;

        let tx = await contract.connect(signer).approve(allowanceTarget, amountToApprove)
        .then( console.log("success "))
        .catch(console.log("success "));

        const swapQuoteJSON = await getQuote();
        console.log("swapQuoteJSON ", swapQuoteJSON);

        // now swap
        tx = await signer.sendTransaction(swapQuoteJSON)
        .then( console.log("success "))
        .catch(console.log("success "));   

        // start the animation
        // but probably I have to listed for an event letting me know the transaction is done?
        //stopWaves();
    }

    return (
        <>
        <TokenList         
            open={tokenList0Open}
            onClose={setTokenList0Open}
            setTokenAddress={setToken0Address}
            setTokenName={setToken0Name}  
        />
        <TokenList         
            open={tokenList1Open}
            onClose={setTokenList1Open}
            setTokenAddress={setToken1Address}
            setTokenName={setToken1Name}  
        />
        <div name='top' className='w-full h-screen'>
            <div className='max-w-[1000px] mx-auto  flex flex-col items-center justify-center h-full z-0'>
            <div className='flex flex-col bg-primary p-10 rounded-lg drop-shadow-2xl'>
                <div><h1 className='text-text'>Swap</h1></div>
                <div className='flex flex-row justify-between bg-secondary drop-shadow-2xl shadow-wave1 border-8 border-wave2 p-1 rounded-lg border-spacing-1'>
                    <div className='flex flex-col mr-5 mt-5'>
                        <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white ml-2 py-2 px-4 border border-blue-500 hover:border-transparent rounded hover:bg-wave2' onClick={showTokenList0}>
                            { token0Name && (
                                token0Name
                            )}
                            { !token0Name && (
                                <>Select A Token</>
                            )}
                        </button>
                    </div>
                    <div className='flex flex-col mr-5 mt-5'>
                        <input className='text-[#808080] flex-none w-48 font-semibold py-2 px-4 border border-blue-500 rounded' 
                               name="token0"
                               type="number"
                               value={token0Amount} 
                               onChange={(e) => {setToken0Amount(e.target.value)}}
                               onBlur={getPrice}> 
                        </input>
                        <span className='text-sm font-semibold text-text'>Balance: {token0Balance}</span>
                        <span className='justify-end text-sm font-semibold text-[#f5ead9]'>Use: <a className="underline" onClick={setPercentOfOwned(50)}>50%</a> | <a className="underline" onClick={setPercentOfOwned(100)}>100%</a></span>
                    </div>
                </div>
                <div className='flex flex-row justify-between bg-secondary drop-shadow-2xl shadow-wave1 border-8 border-wave2 p-1 rounded-lg border-spacing-1 mt-5'>
                   <div className='flex flex-col mr-5 mt-5 mb-5'>
                        <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white ml-2 py-2 px-4 border border-blue-500 hover:border-transparent rounded hover:bg-wave2' onClick={showTokenList1}>
                            { token1Name && (
                                token1Name
                            )}
                            { !token1Name && (
                                <>Select A Token</>
                            )}
                        </button>
                    </div>
                    <div className='mr-5 mt-5 mb-5 '>
                        <input className='flex-none justify-end w-48 bg-transparent hover:bg-blue-500 text-[#808080]  font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded' 
                               type="number" 
                               name="token0"
                               value={token1Amount} 
                               readOnly>
                        </input>
                    </div>
                </div>
                <div className='flex flex-col justify-end mt-3 drop-shadow-2xl shadow-wave1'>
                    <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white mt-2 py-2 px-4 border border-blue-500 hover:border-transparent hover:bg-wave2 rounded' 
                            onClick={trySwap}>
                    Approve
                    </button>
                    <span className='flex flex-row justify-end text-sm font-semibold mt-3'>Gas: {gasPrice}</span>
                    <span className='flex flex-row justify-end text-sm font-semibold'>Swap Fee: {swapFee} </span>
                    <a href="#" onClick={slowDownWaves} className='flex flex-row justify-end text-sm font-semibold'>Slow Waves (for testing purposes) </a>
                </div>
            </div>
    
            </div>
            <div className>
                   <About />                
            </div>
        </div>
        </>
    )
}

export default Home