const deploy = async (account, contract, params, callback) => {
    return await contract.deploy(
        account, 
        contract.getABI(),
        contract.getJSON().bytecode,
        params,
        callback
    )
};

module.exports = { deploy }