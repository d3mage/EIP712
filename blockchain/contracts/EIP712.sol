//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.15;

import "hardhat/console.sol";

contract EIP712 {
    struct Spending {
        string name;
        address to;
        uint256 amount;
    }

    Spending[] private spendings;

    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public immutable SPENDING_TYPEHASH;

    bytes private constant contractName = "EIP712";
    bytes private constant version = "1";
    address private constant verifyingContract =
        0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;

    constructor() {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(contractName),
                keccak256(version),
                chainId,
                verifyingContract
            )
        );

        SPENDING_TYPEHASH = keccak256(
            "Spending(string name,address to,uint256 amount)"
        );
    }

    function createHashStruct(
        string memory name,
        address to,
        uint256 amount
    ) internal view returns (bytes32) {
        return keccak256(
            abi.encode(SPENDING_TYPEHASH, name, to, amount)
        );
    }

    function addSpending(
        string memory name,
        address to,
        uint256 amount,
        bytes calldata sig
    ) external {
        bytes32 hashStruct = createHashStruct(name, to, amount);

        bytes32 hash = keccak256(
            abi.encodePacked(uint16(0x1901), DOMAIN_SEPARATOR, hashStruct)
        );

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(sig);
        address signer = ecrecover(hash, v, r, s);
        require(to == signer, "Invalid signer");
        spendings.push(Spending(name, to, amount));
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
