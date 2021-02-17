/**
 * Copyright (C) SettleMint NV - All Rights Reserved
 *
 * Use of this file is strictly prohibited without an active license agreement.
 * Distribution of this file, via any medium, is strictly prohibited.
 *
 * For license inquiries, contact hello@settlemint.com
 *
 * SPDX-License-Identifier: UNLICENSED
 */

pragma solidity ^0.6.3;

import '@settlemint/enteth-contracts/contracts/tokens/ERC20/ERC20TokenFactory.sol';
import './Loan.sol';

/**
 * @title Factory contract for ERC20-based Loan token
 */
contract LoanFactory is ERC20TokenFactory {
  constructor(address registry, address gk) public ERC20TokenFactory(registry, gk) {}

  /**
   * @notice Factory method to create new ERC20-based Loan token.
   * @dev Restricted to user with the "CREATE_TOKEN_ROLE" permission.
   * @param name the token's name
   * @param decimals the token's number of decimals
   */
  function createToken(string memory name, uint8 decimals)
    public
    authWithCustomReason(CREATE_TOKEN_ROLE, 'Sender needs CREATE_TOKEN_ROLE')
  {
    Loan newToken = new Loan(name, decimals, address(gateKeeper), _uiFieldDefinitionsHash);
    _tokenRegistry.addToken(name, address(newToken));
    emit TokenCreated(address(newToken), name);
    gateKeeper.createPermission(msg.sender, address(newToken), bytes32('REPAY_ROLE'), msg.sender);
    gateKeeper.createPermission(msg.sender, address(newToken), bytes32('MINT_ROLE'), msg.sender);
    gateKeeper.createPermission(msg.sender, address(newToken), bytes32('BURN_ROLE'), msg.sender);
    gateKeeper.createPermission(msg.sender, address(newToken), bytes32('UPDATE_METADATA_ROLE'), msg.sender);
    gateKeeper.createPermission(msg.sender, address(newToken), bytes32('EDIT_ROLE'), msg.sender);
  }
}
