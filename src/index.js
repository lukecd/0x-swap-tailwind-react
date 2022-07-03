import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createRoot } from 'react-dom/client';

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import App from "./App";
import { NextUIProvider } from '@nextui-org/react';

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider } = configureChains(
    [chain.mainnet],
    [
      alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: '0x Swap App',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <WagmiConfig client={wagmiClient}>
  <RainbowKitProvider chains={chains} theme={darkTheme()}>
    <NextUIProvider>
        <div>
          <App />
        </div>
      </NextUIProvider>
  </RainbowKitProvider>
  </WagmiConfig>
);