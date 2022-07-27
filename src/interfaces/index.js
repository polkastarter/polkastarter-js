const fixedswap = () => {
	const originalJson = require("./fixedswap.json");
	originalJson.abi.push(require("./oldredeemmethod.json"));
	return originalJson;
}

let index = {
	fixedswap: fixedswap(),
	fixednftswap: require("./fixednftswap.json"),
	fixedswap_legacy: require("./fixedswap_legacy.json"),
	ierc20: require("./ierc20token.json"),
	staking: require("./staking.json"),
	stakingv3: require("./staking-v3.json"),
	idostaking: require("./idostaking.json"),
};

module.exports = index;
