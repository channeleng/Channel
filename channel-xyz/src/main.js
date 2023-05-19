import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// ethereum composables
import { VagmiPlugin, configureChains, createClient, chain } from 'vagmi';
import { infuraProvider } from 'vagmi/providers/infura';
import { publicProvider } from 'vagmi/providers/public';
import { MetaMaskConnector } from 'vagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'vagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect';
const infuraId = process.env.VUE_APP_INFURA_ID;
const { chains, provider, webSocketProvider } = configureChains([
        chain.mainnet,
        chain.rinkeby,
        chain.goerli,
        chain.optimism,
        chain.optimismKovan
    ], [
    infuraProvider({ infuraId }),
    publicProvider(),
    ]
);
const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({
            chains
        }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});
// end ethereum composables


const app = createApp(App);
app.use(VagmiPlugin(client));
app.use(store);
app.use(router);
app.mount('#app');
