import { CHAINS, PROTOCOLS, AMM_TYPES } from "./sdk/config";
import { getPositionDetailsAtBlock } from "./sdk/subgraphDetails";

const result = getPositionDetailsAtBlock(
        0, // block number 0 for latest block
        2, // position id
        CHAINS.MODE, // chain id
        PROTOCOLS.SUPSWAP, // protocol
        AMM_TYPES.UNISWAPV3 // amm type
    );

result.then((result) => {
    // print response

    console.log(`
        token0: ${JSON.stringify(result[0],null,2)},
        token1: ${JSON.stringify(result[1],null,2)},
        token0AmountsInWei: ${result[2]},
        token1AmountsInWei: ${result[3]}
        token0DerivedUSDPrice: ${result[4]},
        token1DerivedUSDPrice: ${result[5]},
        token0DerivedUSDValue: ${result[6]},
        token1DerivedUSDValue: ${result[7]},
        _meta: ${JSON.stringify(result[8],null,2)}
    `)
});
// getPrice(new BigNumber('1579427897588720602142863095414958'), 6, 18); //Uniswap
// getPrice(new BigNumber('3968729022398277600000000'), 18, 6); //SupSwap

