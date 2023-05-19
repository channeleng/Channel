<script setup>
import { useAccount, useBalance, useEnsName, useDisconnect, useConnect } from 'vagmi';
import Connect from './Connect.vue';
import CheckBalance from './CheckBalance.vue';
import SignMessage from './SignMessage.vue';

const { isConnected, address } = useAccount({});
const { data: ensNameData } = useEnsName({ address });
const { activeConnector } = useConnect();
const { disconnect } = useDisconnect();

</script>

<script>
export default {
    name: 'Wallet',
    data() {
        return  {
            openList: false
        }
    },
    mounted () {
    },
}
</script>

<template>
    <div id="wallet">
        <div v-if="isConnected && activeConnector">
            <div class="list">
                <div class="toggle" @click="openList = true">
                    <span class="placeholder">
                        {{ ensNameData ?? address }}{{ ensNameData ? ` (${address})` : null }}
                    </span>
                    <div class="arrow down"></div>
                </div>
                <ul :class="{show: openList}">
                    <li>
                        <div @click.stop="disconnect(); openList = false">Disconnect</div>
                    </li>
                </ul>
            </div>
        </div>
        <Connect />
    </div>
</template>

<style scoped>
.address {
    font-weight: bold;
    background:#ddd;
    border-radius:15px;
    padding:0.5em 1em;
}
.placeholder {
    display: block;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 70px;
}
.arrow {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
}
.down {
  transform: translateY(-25%) rotate(45deg);
}

.toggle {
    display: flex;
    align-items: center;
}

.list {
    position: relative;
}

.list ul {
    display: none;
    text-align: left;
    position: absolute;
    padding: 0;
    top: 40px;
    left: 0;
}
.list ul.show {
    display: block;
}

.list div {
    cursor: pointer;
}
</style>