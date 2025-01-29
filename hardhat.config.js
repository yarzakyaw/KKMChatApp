require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async (args, hre) => {  
  const accounts = await hre.ethers.getSigners();  
  accounts.forEach((account) => {  
    console.log(account.address);  
  });  
});

task("balances", "Prints the list of ETH account balances", async (args, hre) => {  
  const accounts = await hre.ethers.getSigners();  
  for (const account of accounts) {  
    const balance = await hre.ethers.provider.getBalance(account.address);  
    console.log(`${account.address} has balance ${balance.toString()}`);  
  }  
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.6",
  networks: {
    custom: {
      url: "http://192.168.0.104:8545",
      accounts: [
        "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
        "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
        "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
        "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
      ]
    },
    private: {
      url: "http://127.0.0.1:2463",
      accounts: [  
        "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31",
        "0x39725efee3fb28614de3bacaffe4cc4bd8c436257e2c8bb887c4b5c4be45e76d",
        "0x53321db7c1e331d93a11a41d16f004d7ff63972ec8ec7c25db329728ceeb1710",
        "0xab63b23eb7941c1251757e24b3d2350d2bc05c3c388d06f8fe6feafefb1e8c70",
        "0x5d2344259f42259f82d2c140aa66102ba89b57b4883ee441a8b312622bd42491",
      ],        
    },  
  }
};
