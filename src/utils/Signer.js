/**
 * @typedef Account
 * @type {object}
 * @property {string} address - Address
 * @property {string} privateKey - Private Key
 * @property {Function} sign - Signs a message
*/

/**
 * @typedef SignedAddress
 * @type {object}
 * @property {string} address - Address.
 * @property {string} signature - Signed Address
*/


/**
 * Signer object
 * @constructor Signer
 * @param {Web3} web3 Web3JS Instance
*/
class Signer {

    constructor(web3){
        this.web3 = web3;
    }
    
    /**
	 * @function generateSignerAccount
	 * @description Generates a new private key for signing the whitelist addresses
	 * @param {string} entropy (Optional) a random string to increase entropy.
     * @returns {Account} privateKey
	 */
     generateSignerAccount(entropy) {
        return this.web3.eth.accounts.create(entropy);
    }

    /**
	 * @function getAccountFromPrivateKey
	 * @description Recovers an account given a private key
	 * @param {string} privateKey
     * @returns {Account} Account
	 */
     getAccountFromPrivateKey(privateKey) {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    /**
	 * @function signAddresses
	 * @description Signs an array of addresses. Will ignore malformed addresses.
	 * @param {string[]} addresses List of addresses to sign
     * @param {Account} account Account to sign
     * @returns {SignedAddress[]} signedAddresses
	 */
    signAddresses(addresses, account) {
        const signedAddresses = [];
        let n = 0;
        let r = 0;
        for (const addr of addresses) {
            const result = this._trySignAddress(account, addr);
            if (result) {
                signedAddresses.push({
                    address: addr,
                    signature: result
                });
                n++;
            } else {
                r++;
            }
        }
        console.info(n, "lines successfully processed");
        console.info(r, "lines rejected");
        return signedAddresses;
    }

    /**
	 * @function signMessage
	 * @description Signs a message given an account
	 * @param {Account} account Signer
	 * @param {string} message String to sign
     * @returns {string} signedString
	 */
    signMessage(account, message) {
        return account.sign(message);
    }

    /**
	 * @function signAddress
	 * @description Signs a address given an account
	 * @param {Account} account Signer
	 * @param {string} address Address to sign
     * @returns {string} signedString
	 */
    signAddress(account, address) {
        const messageBytes32 = new Uint8Array(32).fill(0); // create 32 bytes array, fill with '0'
        const messageByteArray = this._arrayify(address); // address is only 20 bytes
        messageBytes32.set(messageByteArray, 12); // insert so that LSB = Uint8Array[31]
        return this.signMessage(account, this._arrayify(messageBytes32)).signature;
    }

    _trySignAddress(account, address) {      
        if (this.web3.utils.isAddress(address) && address != '0x0000000000000000000000000000000000000000') {
            return this.signAddress(account, address);
        } else {
          console.error("address not valid - ignored :", address);
          return "";
        }
    }

    _arrayify(value, options) {
        if (!options) {
            options = {};
        }
        if (typeof (value) === "number") {
            var result = [];
            while (value) {
                result.unshift(value & 0xff);
                value = parseInt(String(value / 256));
            }
            if (result.length === 0) {
                result.push(0);
            }
            return this._addSlice(new Uint8Array(result));
        }
        if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
            value = "0x" + value;
        }
        if (this._isHexable(value)) {
            value = value.toHexString();
        }
        if (this._isHexString(value)) {
            var hex = value.substring(2);
            if (hex.length % 2) {
                if (options.hexPad === "left") {
                    hex = "0x0" + hex.substring(2);
                }
                else if (options.hexPad === "right") {
                    hex += "0";
                }
                else {
                    throw Error("hex data is odd-length", "value", value);
                }
            }
            var result = [];
            for (var i = 0; i < hex.length; i += 2) {
                result.push(parseInt(hex.substring(i, i + 2), 16));
            }
            return this._addSlice(new Uint8Array(result));
        }
        if (this._isBytes(value)) {
            return this._addSlice(new Uint8Array(value));
        }
        throw Error("invalid arrayify value", "value", value);
    }

    _isHexable(value) {
        return !!(value.toHexString);
    }

    _isHexString(value, length) {
        if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
            return false;
        }
        if (length && value.length !== 2 + 2 * length) {
            return false;
        }
        return true;
    }

    _addSlice(array) {
        if (array.slice) {
            return array;
        }
        array.slice = function () {
            var args = Array.prototype.slice.call(arguments);
            return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
        };
        return array;
    }

    _isBytes(value) {
        if (value == null) {
            return false;
        }
        if (value.constructor === Uint8Array) {
            return true;
        }
        if (typeof (value) === "string") {
            return false;
        }
        if (value.length == null) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            if (typeof (v) !== "number" || v < 0 || v >= 256 || (v % 1)) {
                return false;
            }
        }
        return true;
    }
}

export default Signer;