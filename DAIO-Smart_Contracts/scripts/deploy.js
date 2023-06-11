const hre = require("hardhat");
const { verify } = require("./verify");
async function main() {
  // We get the contract to deploy
  const daio = await hre.ethers.getContractFactory("DAiO");
  // We set the constructor of the contract within a message
  const daioContract = await daio.deploy(1);
  await daioContract.deployed();
  console.log("Contract deployed to:", daioContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
