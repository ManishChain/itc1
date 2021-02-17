"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enteth_migration_utils_1 = require("@settlemint/enteth-migration-utils");
const dayjs_1 = __importDefault(require("dayjs"));
const GateKeeper = artifacts.require('GateKeeper');
const WarehouseRegistry = artifacts.require('WarehouseRegistry');
const WarehouseFactory = artifacts.require('WarehouseFactory');
const AdminRoleRegistry = artifacts.require('AdminRoleRegistry');
const TMRoleRegistry = artifacts.require('TMRoleRegistry');
const SECRoleRegistry = artifacts.require('SECRoleRegistry');
const REPRoleRegistry = artifacts.require('REPRoleRegistry');
const WSPRoleRegistry = artifacts.require('WSPRoleRegistry');
const BOMRoleRegistry = artifacts.require('BOMRoleRegistry');
const FMRoleRegistry = artifacts.require('FMRoleRegistry');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { enabledFeatures, storeIpfsHash } = require('../../truffle-config.js'); // two dirs up, because it is compiled into ./dist/migrations
module.exports = async (deployer, network, accounts) => {
    if (enabledFeatures().includes('Warehouse')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const uiDefinitions = require('../../contracts/Warehouse/UIDefinitions.json');
        const { factory } = await enteth_migration_utils_1.deployStateMachineSystem(deployer, accounts, GateKeeper, WarehouseRegistry, WarehouseFactory, [AdminRoleRegistry, TMRoleRegistry, SECRoleRegistry, REPRoleRegistry, WSPRoleRegistry, BOMRoleRegistry, FMRoleRegistry], uiDefinitions, storeIpfsHash);
        const Warehouses = [
            {
                Invoice: 'Warehouse-1',
                price: '12300',
                quantity: '230 MT',
                delivery_period: dayjs_1.default('2020-08-08').unix(),
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
async function createWarehouse(factory, Warehouse) {
    const ipfsHash = await enteth_migration_utils_1.storeIpfsJsonData({
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
//# sourceMappingURL=25_deploy_warehouse.js.map