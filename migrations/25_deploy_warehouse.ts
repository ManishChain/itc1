import { deployStateMachineSystem, storeIpfsJsonData } from '@settlemint/enteth-migration-utils';
import dayjs from 'dayjs';

import { AdminRoleRegistryContract } from '../types/truffle-contracts/AdminRoleRegistry';
import { GateKeeperContract } from '../types/truffle-contracts/GateKeeper';
import {
  WarehouseFactoryContract,
  WarehouseFactoryInstance,
} from '../types/truffle-contracts/WarehouseFactory';
import { WarehouseRegistryContract } from '../types/truffle-contracts/WarehouseRegistry';

import { TMRoleRegistryContract } from '../types/truffle-contracts/TMRoleRegistry';
import { SECRoleRegistryContract } from '../types/truffle-contracts/SECRoleRegistry';
import { REPRoleRegistryContract } from '../types/truffle-contracts/REPRoleRegistry';
import { WSPRoleRegistryContract } from '../types/truffle-contracts/WSPRoleRegistry';
import { BOMRoleRegistryContract } from '../types/truffle-contracts/BOMRoleRegistry';
import { FMRoleRegistryContract } from '../types/truffle-contracts/FMRoleRegistry';

const GateKeeper: GateKeeperContract = artifacts.require('GateKeeper');
const WarehouseRegistry: WarehouseRegistryContract = artifacts.require('WarehouseRegistry');
const WarehouseFactory: WarehouseFactoryContract = artifacts.require('WarehouseFactory');
const AdminRoleRegistry: AdminRoleRegistryContract = artifacts.require('AdminRoleRegistry');

const TMRoleRegistry: TMRoleRegistryContract = artifacts.require('TMRoleRegistry');
const SECRoleRegistry: SECRoleRegistryContract = artifacts.require('SECRoleRegistry');
const REPRoleRegistry: REPRoleRegistryContract = artifacts.require('REPRoleRegistry');
const WSPRoleRegistry: WSPRoleRegistryContract = artifacts.require('WSPRoleRegistry');
const BOMRoleRegistry: BOMRoleRegistryContract = artifacts.require('BOMRoleRegistry');
const FMRoleRegistry: FMRoleRegistryContract = artifacts.require('FMRoleRegistry');


// eslint-disable-next-line @typescript-eslint/no-var-requires
const { enabledFeatures, storeIpfsHash } = require('../../truffle-config.js'); // two dirs up, because it is compiled into ./dist/migrations

module.exports = async (deployer: Truffle.Deployer, network: string, accounts: string[]) => {
  if (enabledFeatures().includes('Warehouse')) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uiDefinitions = require('../../contracts/Warehouse/UIDefinitions.json');

    const { factory } = await deployStateMachineSystem(
      deployer,
      accounts,
      GateKeeper,
      WarehouseRegistry,
      WarehouseFactory,
      [AdminRoleRegistry, TMRoleRegistry, SECRoleRegistry, REPRoleRegistry, WSPRoleRegistry, BOMRoleRegistry, FMRoleRegistry],
      uiDefinitions,
      storeIpfsHash
    );

    const Warehouses = [
      {
        Invoice: 'Warehouse-1',
        price: '12300',
        quantity: '230 MT',
        delivery_period: dayjs('2020-08-08').unix(),
        delivery_place: 'Delhi',
        quality: 'Best',
        variety: 'GRAN',
        mandi_doc: 'QmUF8Ehv5REwdJSE64Cp379vRhnVqH7yxUE67vhxUVmevT',
        register_in: 'Comments at entry',
        register_out: 'Comments at exit',
        warehouse_name: 'Arya Warehouse',
        vendor_name: 'Warehouse - Agri Business Division',
      },
    ];
    for (const awarehouse of Warehouses) {
      await createWarehouse(factory, awarehouse);
    }
  }
};

async function createWarehouse(
  factory: WarehouseFactoryInstance,
  Warehouse: { 
    Invoice: string;
    price: string;
    quantity: string;
    delivery_period: number;
    delivery_place: string;
    quality: string;
    variety: string;
    mandi_doc: string;
    register_in: string;
    register_out: string;
    warehouse_name: string;
    vendor_name: string;
  }
) {
  const ipfsHash = await storeIpfsJsonData({
    price: Warehouse.price,
    quantity: Warehouse.quantity,
    delivery_period: Warehouse.delivery_period,
    delivery_place: Warehouse.delivery_place,
    quality: Warehouse.quality,
    variety: Warehouse.variety,
    mandi_doc: Warehouse.mandi_doc,
    register_in: Warehouse.register_in,
    register_out: Warehouse.register_out,
    warehouse_name: Warehouse.warehouse_name,
    vendor_name: Warehouse.vendor_name,
  });
  await factory.create(Warehouse.Invoice, ipfsHash);
}
