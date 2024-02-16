import BigNumber from "bignumber.js";
import { CHAINS, PROTOCOLS, AMM_TYPES } from "./sdk/config";
import { getLPValueByUserAndPoolFromPositions, getPositionAtBlock, getPositionDetailsFromPosition, getPositionsForAddressByPoolAtBlock } from "./sdk/subgraphDetails";
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



const getData = async () => {


const snapshotBlocks = [
  3092881,
  3232712,
  3276348,
  3283142,
  3276446,
  3776408
];

for(let block of snapshotBlocks) {
  
  const positions = await getPositionsForAddressByPoolAtBlock(
    block, // block number 0 for latest block
    "",  //pass empty string to remove filter based on user address
    "",  //pass empty string to remove filter based on pool address
    CHAINS.MODE, // chain id
    PROTOCOLS.SUPSWAP, // protocol
    AMM_TYPES.UNISWAPV3 // amm type
  );
 console.log(`Block: ${block}`);
    // print response

    console.log("Positions: ", positions.length)

    let positionsWithUSDValue = positions.map((position) => {
      return getPositionDetailsFromPosition(position);
    });

    let lpValueByUsers = getLPValueByUserAndPoolFromPositions(positionsWithUSDValue);

    lpValueByUsers.forEach((value, key) => {
      console.log(`User: ${key}`);
      let lpValue: Map<string, BigNumber> = value;
      lpValue.forEach((value, key) => {
        console.log(`Pool: ${key} LP Value: ${value.toString()}`);
      }
      );
      console.log("---------------------------------------------------");
    });
}
}

getData().then(() => {
  console.log("Done");
});

// getPrice(new BigNumber('1579427897588720602142863095414958'), 6, 18); //Uniswap
// getPrice(new BigNumber('3968729022398277600000000'), 18, 6); //SupSwap

