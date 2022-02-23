
class DeploymentService {
    
    async deploy(account, contract, params, callback) {
        return await contract.deploy(
            account,
            contract.getABI(),
            contract.getJSON().bytecode,
            params,
            callback
        )
    };

}

export default DeploymentService;