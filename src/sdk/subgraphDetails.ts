import BigNumber from "bignumber.js";
import { AMM_TYPES, CHAINS, PROTOCOLS, SUBGRAPH_URLS } from "./config";
import { PositionMath } from "./utils/positionMath";

export const getPositionDetailsAtBlock = async (
    blockNumber: number,
    positionId: number,
    chainId: CHAINS,
    protocol: PROTOCOLS,
    ammType: AMM_TYPES
) => {
    let subgraphUrl = SUBGRAPH_URLS[chainId][protocol][ammType];
    let blockQuery = blockNumber !== 0 ? `, block: {number: ${blockNumber}}` : ``;
    let query = `{
        position(id: "${positionId}" ${blockQuery}) {
            id
            pool {
                sqrtPrice
                tick
            }
            tickLower{
                tickIdx
            }
            tickUpper{
                tickIdx
            }
            liquidity
            token0 {
                id
                decimals
                derivedUSD
                name
                symbol
            }
            token1 {
                id
                decimals
                derivedUSD
                name
                symbol
            }
        },
        _meta{
                block{
                number
            }
        }
    }`;
    let response = await fetch(subgraphUrl, {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    console.log(data);
    let position = data.data.position;
    let tickLow = Number(position.tickLower.tickIdx);
    let tickHigh = Number(position.tickUpper.tickIdx);
    let liquidity = BigInt(position.liquidity);
    let sqrtPriceX96 = BigInt(position.pool.sqrtPrice);
    let tick = Number(position.pool.tick);
    let decimal0 = position.token0.decimals;
    let decimal1 = position.token1.decimals;
    let token0DerivedUSD = position.token0.derivedUSD;
    let token1DerivedUSD = position.token1.derivedUSD;
    let token0AmountsInWei = PositionMath.getToken0Amount(tick, tickLow, tickHigh, sqrtPriceX96, liquidity);
    let token1AmountsInWei = PositionMath.getToken1Amount(tick, tickLow, tickHigh, sqrtPriceX96, liquidity);
    

    let token0DecimalValue = Number(token0AmountsInWei) / 10 ** decimal0;
    let token1DecimalValue = Number(token1AmountsInWei) / 10 ** decimal1;
    
    let token0UsdValue = BigNumber(token0AmountsInWei.toString()).multipliedBy(token0DerivedUSD).div(10 ** decimal0).toFixed(4);
    let token1UsdValue = BigNumber(token1AmountsInWei.toString()).multipliedBy(token1DerivedUSD).div(10 ** decimal1).toFixed(4);

    return [position.token0, position.token1,token0AmountsInWei, token1AmountsInWei, token0DecimalValue, token1DecimalValue,token0UsdValue, token1UsdValue,data.data._meta];
}