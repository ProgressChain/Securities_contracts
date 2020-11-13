## `STBXToken`



STBX ERC20 Token

### `onlyWhitelisted(address _account)`





### `onlyWithUnfrozenFunds(address _account)`






### `constructor()` (public)

STBXToken simply implements a ERC20 token.



### `addAddressToWhitelist(address _address)` (external)

Add an address to the whitelist.




### `removeAddressFromWhitelist(address _address)` (external)

Remove an address from the whitelist.




### `freezeFunds(address _account)` (external)

Freeze all funds at the address.




### `unfreezeFunds(address _account)` (external)

Unfreeze all funds at the address.




### `mint(address _account, uint256 _amount)` (external)

Minting of new tokens to the address.




### `burn(address _account, uint256 _amount)` (external)

Burning of tokens from the address.




### `transferFunds(address _from, address _where, uint256 _amount) → bool` (external)

Transfer funds from one address to another.




### `splitOrMerge(uint256 _x, uint256 _y)` (external)

Stock split or merge (consolidation).


1-2: one share turns into two. 3-2: three shares turns into two.
Requirements:
- `_x` must not be equal to `_y`.
- `_x` and `_y` must be greater than 0.

### `setTransferLimit(address _account, uint256 _transferLimit)` (external)

Set transfer limit for address.




### `isWhitelistedAddress(address _address) → bool` (external)

Checking if the address is whitelisted.




### `isFrozenFunds(address _account) → bool` (external)

Checking if the funds are frozen.




### `name() → string` (public)

Returns the name of the token.



### `symbol() → string` (public)

Returns the symbol of the token.



### `decimals() → uint8` (public)

Returns the number of decimals used to get its user representation.



### `totalSupply() → uint256` (public)

Returns the amount of tokens in existence.



### `balanceOf(address _account) → uint256` (public)

Returns the amount of tokens owned by `_account`.




### `getTransferLimit(address _account) → uint256` (public)

Returns transfer limit for `_account`.
Can be defaul value or personally assigned to the `_account` value.




### `getAllowedToTransfer(address _account) → uint256` (public)

Get the number of tokens that can be transferred today
by `_account`. Can be 0 in 2 cases:
a) `_updateTransferLimit` function not called yet;
b) transfer limit was set to 0 by limiter.




### `transfer(address _recipient, uint256 _amount) → bool` (public)

Moves `_amount` tokens from the caller's account to `_recipient`.
Emits a {Transfer} event.




### `allowance(address _owner, address _spender) → uint256` (public)

the remaining number of tokens that `_spender` will be
allowed to spend on behalf of `_owner` through {transferFrom}. This is
zero by default.




### `approve(address _spender, uint256 _amount) → bool` (public)

Sets `_amount` as the allowance of `_spender` over the caller's tokens.
Emits an {Approval} event.




### `transferFrom(address _sender, address _recipient, uint256 _amount) → bool` (public)

Moves `_amount` tokens from `_sender` to `_recipient` using the
allowance mechanism. `_amount` is then deducted from the caller's
allowance.
Emits a {Transfer} event.




### `increaseAllowance(address _spender, uint256 _addedValue) → bool` (public)

Increase allowance for the `_spender`.




### `decreaseAllowance(address _spender, uint256 _subtractedValue) → bool` (public)

Decrease allowance for the `_spender`.




### `_transfer(address _sender, address _recipient, uint256 _amount)` (internal)

Moves tokens `_amount` from `_sender` to `_recipient`.
Emits a {Transfer} event.




### `_mint(address _account, uint256 _amount)` (internal)

Creates `_amount` tokens and assigns them to `_account`, increasing
the total supply.
Emits a {Transfer} event with `_from` set to the zero address.




### `_burn(address _account, uint256 _amount)` (internal)

Destroys `_amount` tokens from `_account`, reducing the
total supply.
Emits a {Transfer} event with `_to` set to the zero address.




### `_approve(address _owner, address _spender, uint256 _amount)` (internal)

Sets `_amount` as the allowance of `_spender` over the `_owner` s tokens.
Emits an {Approval} event.




### `_beforeTokenTransfer(address _from, address _to, uint256 _amount)` (internal)

Hook that is called before any transfer of tokens. This includes
minting and burning.





