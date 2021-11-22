import * as ethers from 'ethers';
import Numbers from "./Numbers";

/**
 * @typedef Signer
 * @type {object}
 * @property {Function} signMessage - Signs a message
*/

/**
 * @typedef SignedAddress
 * @type {object}
 * @property {string} address - Address.
 * @property {string} allocation - Max Allocation.
 * @property {string} signature - Signed Address
*/


/**
 * Signer object
 * @constructor Signer
*/
class Signer {
    
    /**
	 * @function generateSignerAccount
	 * @description Generates a new private key for signing the whitelist addresses
	 * @param {string} password Password for encryption
	 * @param {string=} entropy Add more entropy
     * @returns {string} JSON Account
	 */
    async generateSignerAccount({password, entropy}) {
        const wallet = ethers.Wallet.createRandom(entropy)

        return await wallet.encrypt(password);
    }

    /**
	 * @function getAddressFromAccount
	 * @description Recovers an account given a json file
     * @param {string} accountJson Account in a json format
     * @param {string} password Password to unlock the account
     * @returns {string} Address
	 */
     getAddressFromAccount({accountJson, password}) {
        const signer = ethers.Wallet.fromEncryptedJsonSync(
            accountJson,
            password
        );
        return signer.address;
    }

    /**
	 * @function signAddresses
	 * @description Signs an array of addresses. Will ignore malformed addresses.
	 * @param {string[]} addresses List of addresses to sign
     * @param {string} accountJson Account in a json format
	 * @param {number[]} accountMaxAllocations List of mac allocations in wei
	 * @param {number} decimals Decimals for the max allocation
	 * @param {string} contractAddress Pool
     * @param {string} password Password to unlock the account
     * @returns {SignedAddress[]} signedAddresses
	 */
    async signAddresses({addresses, accountJson, password, accountMaxAllocations, contractAddress, decimals}) {
        const signer = ethers.Wallet.fromEncryptedJsonSync(
            accountJson,
            password
        );
        return await this.signAddressesWithSigner({addresses, accountMaxAllocations, contractAddress, decimals, signer});
    }

    /**
	 * @function signAddressesWithSigner
	 * @description Signs an array of addresses. Will ignore malformed addresses.
	 * @param {string[]} addresses List of addresses to sign
	 * @param {number[]} accountMaxAllocations List of mac allocations in wei
	 * @param {number} decimals Decimals for the max allocation
	 * @param {string} contractAddress Pool
     * @param {Signer} signer Signer object
     * @returns {SignedAddress[]} signedAddresses
	 */
    async signAddressesWithSigner({addresses, accountMaxAllocations, contractAddress, decimals, signer}) {
        const signedAddresses = [];
        let n = 0;
        let r = 0;
        let index = 0;
        for (const addr of addresses) {
            const allocation = Numbers.toSmartContractDecimals(
                accountMaxAllocations[index],
                decimals
            );
            const result = await this._trySignAddress(signer, addr, allocation, contractAddress);
            if (result) {
                signedAddresses.push({
                    address: addr,
                    signature: result,
                    allocation: allocation,
                });
                n++;
            } else {
                r++;
            }
            index++;
        }
        console.info(n, "lines successfully processed");
        console.info(r, "lines rejected");
        return signedAddresses;
    }

    /**
	 * @function signMessage
	 * @description Signs a message given an account
	 * @param {Signer} signer Signer
	 * @param {string} message String to sign
     * @returns {string} signedString
	 */
    async signMessage({signer, message}) {
        return await signer.signMessage(message);
    }

    /**
	 * @function verifySignature
	 * @description Verifies if an address has been signed with the signer address
     * @param {string} signature Signature
	 * @param {string} address Address signed
	 * @param {string} contractAddress Pool contract address
	 * @param {string} accountMaxAllocation Max allocation
	 * @param {string} signerAddress Address who signed the message
     * @returns {boolean} verified
	 */
    async verifySignature({signature, address, accountMaxAllocation, contractAddress, signerAddress}) {
        try {
            const actualAddress = ethers.utils.verifyMessage(this._addressToBytes32(address, accountMaxAllocation, contractAddress), signature);
            return signerAddress.toLowerCase() === actualAddress.toLowerCase();
        } catch (e) {
            return false;
        }
    }

    /**
	 * @function signAddress
	 * @description Signs a address given an account
     * @param {Signer} signer Signer object
	 * @param {string} address Address to sign
	 * @param {string} contractAddress Pool contract address
	 * @param {string} accountMaxAllocation Max allocation
     * @returns {string} signedString
	 */
    async signAddress({signer, address, accountMaxAllocation, contractAddress}) {
        return await this.signMessage({signer, message: this._addressToBytes32(address, accountMaxAllocation, contractAddress)});
    }

    async _trySignAddress(signer, address, accountMaxAllocation, contractAddress) {      
        if (ethers.utils.isAddress(address) && ethers.BigNumber.from(address) != 0) {
            return await this.signAddress({signer, address, accountMaxAllocation, contractAddress});
        } else {
          console.error("address not valid - ignored :", address);
          return "";
        }
    }
    

    _addressToBytes32(address, accountMaxAllocation, contractAddress) {
        const messageHash = ethers.utils.solidityKeccak256(
            ["address", "uint256", "address"],
            [address, accountMaxAllocation, contractAddress],
        );
      
        return ethers.utils.arrayify(messageHash);
    }
}

export default Signer;