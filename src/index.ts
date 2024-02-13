import { CHAINS, PROTOCOLS, AMM_TYPES } from "./sdk/config";
import { getPositionAtBlock, getPositionDetailsFromPosition, getPositionsForAddressByPoolAtBlock } from "./sdk/subgraphDetails";
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

//Uncomment the following lines to test the getPositionAtBlock function

// const position = getPositionAtBlock(
//         0, // block number 0 for latest block
//         2, // position id
//         CHAINS.MODE, // chain id
//         PROTOCOLS.SUPSWAP, // protocol
//         AMM_TYPES.UNISWAPV3 // amm type
//     );
// position.then((position) => {
//     // print response
//     const result = getPositionDetailsFromPosition(position);
//     console.log(`${JSON.stringify(result,null, 4)}
//     `)
// });




const positions = getPositionsForAddressByPoolAtBlock(
        0, // block number 0 for latest block
        "0xeD5C73F229D1f085c441CAc3D9d8dee9C44dd475",  //pass empty string to remove filter based on user address
        "0xf2e9c024f1c0b7a2a4ea11243c2d86a7b38dd72f",  //pass empty string to remove filter based on pool address
        CHAINS.MODE, // chain id
        PROTOCOLS.SUPSWAP, // protocol
        AMM_TYPES.UNISWAPV3 // amm type
    );

positions.then((positions) => {
    // print response

    console.log("Positions: ", positions.length)

    positions.forEach((position) => {

    const result = getPositionDetailsFromPosition(position);
    console.log(`${JSON.stringify(result,null, 4)}`)
    
    });
});



// getPrice(new BigNumber('1579427897588720602142863095414958'), 6, 18); //Uniswap
// getPrice(new BigNumber('3968729022398277600000000'), 18, 6); //SupSwap

