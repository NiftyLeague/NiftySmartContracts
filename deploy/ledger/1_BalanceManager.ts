import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getLedgerSigner } from '../../scripts/ledger';
import { NFTL_TOKEN_ADDRESS, NIFTY_LEDGER_DEPLOYER } from '../../constants/addresses';
import { NetworkName } from '../../types';

const deployBalanceManager = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  try {
    const deployer = await getLedgerSigner();

    await deploy('BalanceManager', {
      from: await deployer.getAddress(),
      args: [],
      log: true,
      proxy: {
        proxyContract: 'OpenZeppelinTransparentProxy',
        viaAdminContract: 'DefaultProxyAdmin',
        execute: {
          init: {
            methodName: 'initialize',
            args: [NFTL_TOKEN_ADDRESS[hre.network.name as NetworkName], NIFTY_LEDGER_DEPLOYER],
          },
        },
      },
    });
  } catch (err) {
    console.log('\nFailed in the BalanceManager contract deployment using the ledger\n');
  }
};
module.exports = deployBalanceManager;
deployBalanceManager.tags = ['BalanceManager'];
