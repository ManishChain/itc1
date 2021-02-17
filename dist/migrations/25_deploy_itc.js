"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enteth_migration_utils_1 = require("@settlemint/enteth-migration-utils");
const dayjs_1 = __importDefault(require("dayjs"));
const GateKeeper = artifacts.require('GateKeeper');
const ITCRegistry = artifacts.require('ITCRegistry');
const ITCFactory = artifacts.require('ITCFactory');
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
    if (enabledFeatures().includes('ITC')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const uiDefinitions = require('../../contracts/ITC/UIDefinitions.json');
        const { factory } = await enteth_migration_utils_1.deployStateMachineSystem(deployer, accounts, GateKeeper, ITCRegistry, ITCFactory, [AdminRoleRegistry, TMRoleRegistry, SECRoleRegistry, REPRoleRegistry, WSPRoleRegistry, BOMRoleRegistry, FMRoleRegistry], uiDefinitions, storeIpfsHash);
        const ITCs = [
            {
                Invoice: 'ITC-1',
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
                vendor_name: 'ITC - Agri Business Division',
            },
        ];
        for (const aitc of ITCs) {
            await createITC(factory, aitc);
        }
    }
};
async function createITC(factory, ITC) {
    const ipfsHash = await enteth_migration_utils_1.storeIpfsJsonData({
        price: ITC.price,
        quantity: ITC.quantity,
        delivery_period: ITC.delivery_period,
        delivery_place: ITC.delivery_place,
        quality: ITC.quality,
        variety: ITC.variety,
        mandi_doc: ITC.mandi_doc,
        register_in: ITC.register_in,
        register_out: ITC.register_out,
        warehouse_name: ITC.warehouse_name,
        vendor_name: ITC.vendor_name,
    });
    await factory.create(ITC.Invoice, ipfsHash);
}
//# sourceMappingURL=25_deploy_itc.js.map