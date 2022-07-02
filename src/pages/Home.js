import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import TokenList from '../components/TokenList'
import * as qs from 'qs'
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

    const [token0Balance, setToken0Balance] = useState(0);
    const [token0Amount, setToken0Amount] = useState(0);
    const [token1Amount, setToken1Amount] = useState(0);
    const [gasPrice, setGasPrice] = useState();
    const [swapFee, setSwapFee] = useState();

    const showTokenList0 = () => {
        setTokenList0Open(true);
    }

    const showTokenList1= () => {
        setTokenList1Open(true);
    }

    const set50 = () => {

    }

    const swap = () => {
        console.log('swap')
    }

    const getPrice = async () => {
        let amount = token0Amount;
        amount = ethers.utils.parseEther(amount);
        console.log(" amount", amount)

        const params = {
            sellToken: token0Address,
            buyToken: token1Address,
            sellAmount: '100000000000000000000'
        }
        

        // fetch the swap pric
        console.log('URL')
        console.log(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`)
        const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
        let swapPriceJSON = await response.json();
        console.log("swapPriceJSON buyAmount", swapPriceJSON.buyAmount);
        setToken1Amount(ethers.utils.formatEther(swapPriceJSON.buyAmount));
        setGasPrice(swapPriceJSON.estimatedGas);
        setSwapFee(swapPriceJSON.protocolFee);
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
        <div name='top' className='w-full h-screen bg-[#45819F] '>
            <div className='max-w-[1000px] mx-auto  flex flex-col items-center justify-center h-full z-0'>
            <div className='flex flex-col bg-[#029AD1] p-10 rounded-lg drop-shadow-2xl'>
                <div><h1>Swap</h1></div>
                <div className='flex flex-row justify-between bg-[#EA06A1] p-1 rounded-lg border-spacing-1'>
                    <div className='flex flex-col mr-5 mt-5'>
                        <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white ml-2 py-2 px-4 border border-blue-500 hover:border-transparent rounded hover:bg-[#029AD1]' onClick={showTokenList0}>
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
                               value={token0Amount} onChange={(e) => {setToken0Amount(e.target.value); getPrice()}}> 
                        </input>
                        <span className='text-sm font-semibold text-[#f5ead9]'>Balance: {token0Balance}</span>
                        <span className='justify-end text-sm font-semibold text-[#f5ead9]'>Use: <a className="underline" onClick={set50}>50%</a> | <a className="underline" onClick={set50}>100%</a></span>
                    </div>
                </div>
                <div className='flex flex-row justify-between bg-[#EA06A1] p-1 rounded-lg border-spacing-1 mt-5 mb-5'>
                    <div className='flex flex-col mr-5 mt-5 mb-5'>
                        <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white ml-2 py-2 px-4 border border-blue-500 hover:border-transparent hover:bg-[#029AD1] rounded' onClick={showTokenList1}>
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
                               value={token1Amount} >
                        </input>
                    </div>
                </div>
                <div className='flex flex-col justify-end '>
                    <button className='bg-transparent hover:bg-blue-500 text-[#f5ead9] font-semibold hover:text-white mt-2 py-2 px-4 border border-blue-500 hover:border-transparent hover:bg-[#EA06A1] rounded' onClick={swap}>
                    Approve
                    </button>
                    <span className='flex flex-row justify-end text-sm font-semibold'>Gas: {gasPrice}</span>
                    <span className='flex flex-row justify-end text-sm font-semibold'>Swap Fee: {swapFee} </span>
                </div>
            </div>
    
            </div>
        </div>
        </>
    )
}

export default Home