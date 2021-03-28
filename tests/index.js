import chai from "chai";
import { mochaAsync } from "./utils";
import moment from "moment";
import Application from "../src/models";
import delay from "delay";
import Numbers from "../src/utils/Numbers";
const ERC20TokenAddress = "0x7a7748bd6f9bac76c2f3fcb29723227e3376cbb2";
var contractAddress = "0x420751cdeb28679d8e336f2b4d1fc61df7439b5a";
var userPrivateKey =
	"0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132";

const expect = chai.expect;
const tokenPurchaseAmount = 0.000000000002145546;
const tokenFundAmount = 0.00000000000345546;
const tradeValue = 0.00000000000123333;

context("Tests", async () => {
	var swapContract;
	var app;

	before(async () => {
		app = new Application({ test: true, mainnet: false });
	});

	it(
		"should verify all corner cases for decimals",
		mochaAsync(async () => {
			// Failed Previously (decimals have to be 0)
			let value = Numbers.toSmartContractDecimals(1 / 321600, 18);
			expect(value).to.equal(
				parseInt((1 / 321600) * 10 ** 18).toString()
			);
			value = Numbers.toSmartContractDecimals(1 / 450400, 18);
			expect(value).to.equal(
				parseInt((1 / 450400) * 10 ** 18).toString()
			);
			// Failed Previously (has to be int)
			value = Numbers.toSmartContractDecimals(1 / 100000, 18);
			expect(value).to.equal(
				parseInt((1 / 100000) * 10 ** 18).toString()
			);
		})
	);

	it(
		"should deploy Fixed Swap Contract",
		mochaAsync(async () => {
			app = new Application({ test: true, mainnet: false });
			/* Create Contract */
			swapContract = app.getFixedSwapContract({
				tokenAddress: ERC20TokenAddress,
				decimals: 18,
			});
			/* Deploy */
			let res = await swapContract.deploy({
				tradeValue: tradeValue,
				tokensForSale: tokenFundAmount,
				isTokenSwapAtomic: true,
				individualMaximumAmount: tokenFundAmount,
				startDate: moment().add(5, "minutes"),
				endDate: moment().add(8, "minutes"),
				hasWhitelisting: true,
			});
			contractAddress = swapContract.getAddress();
			expect(res).to.not.equal(false);
		})
	);

	it(
		"should get a Fixed Swap Contract From contractAddress",
		mochaAsync(async () => {
			/* Get Contract */
			swapContract = app.getFixedSwapContract({ contractAddress });
			swapContract.__init__();
			await swapContract.assertERC20Info();
			expect(swapContract).to.not.equal(false);
		})
	);

	it(
		"SET - whitelisted Addresses",
		mochaAsync(async () => {
			let add = await swapContract.addWhitelistedAddress({
				addresses: [
					"0x43257a77e909ca48e4c2cc44687ffeb79b0e0b98",
					"0x98c039e95e7c555534a53f12ae2ac2d3398d534b",
				],
			});
			expect(add).to.not.equal(false);
		})
	);

	it(
		"SET - whitelisted Addresses (with repeated ones)",
		mochaAsync(async () => {
			let res = await swapContract.addWhitelistedAddress({
				addresses: [
					"0x43257a77e909ca48e4c2cc44687ffeb79b0e0b98",
					"0x98c039e95e7c555534a53f12ae2ac2d3398d534b",
					"0x98c039e95e7c555534a53f12ae2ac2d3398d534c",
				],
			});
			expect(res).to.not.equal(false);
			res = await swapContract.getWhitelistedAddresses();
			expect(res.length).to.equal(3);
		})
	);

	it(
		"GET - isPreFunded",
		mochaAsync(async () => {
			let res = await swapContract.isPreStart();
			expect(res).to.equal(true);
		})
	);

	it(
		"GET - tokensAllocated",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensAllocated();
			expect(tokens).to.equal(Number(0).noExponents());
		})
	);

	it(
		"GET - tradeValue",
		mochaAsync(async () => {
			let td = await swapContract.tradeValue();
			expect(td).to.equal(Number(tradeValue).noExponents());
		})
	);

	it(
		"GET - tokensAvailable",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensAvailable();
			expect(tokens).to.equal(Number(0).noExponents());
		})
	);

	it(
		"GET - tokensForSale",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensForSale();
			expect(Number(tokens).noExponents()).to.equal(
				Number(tokenFundAmount).noExponents()
			);
		})
	);

	it(
		"GET - tokensLeft",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensLeft();
			expect(Number(tokens).noExponents()).to.equal(
				Number(tokenFundAmount).noExponents()
			);
		})
	);

	it(
		"should fund a Swap Contract and confirm balances",
		mochaAsync(async () => {
			/* Approve ERC20 Fund */
			let res = await swapContract.approveFundERC20({
				tokenAmount: tokenFundAmount,
			});
			expect(res).to.not.equal(false);
			res = await swapContract.isApproved({
				address: app.account.getAddress(),
				tokenAmount: tokenFundAmount,
			});
			expect(res).to.equal(true);
			/* Fund */
			res = await swapContract.hasStarted();
			expect(res).to.equal(false);
			res = await swapContract.fund({ tokenAmount: tokenFundAmount });
			expect(res).to.not.equal(false);
		})
	);

	it(
		"GET - tokensAvailable",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensAvailable();
			expect(tokens).to.equal(Number(tokenFundAmount).noExponents());
		})
	);

	it(
		"GET - isFunded",
		mochaAsync(async () => {
			let res = await swapContract.isFunded();
			expect(res).to.equal(true);
		})
	);

	it(
		"GET - hasStarted",
		mochaAsync(async () => {
			await delay(5 * 1000);
			let res = await swapContract.hasStarted();
			expect(res).to.equal(true);
		})
	);

	it(
		"GET - isSaleOpen",
		mochaAsync(async () => {
			let res = await swapContract.isOpen();
			expect(res).to.equal(true);
		})
	);

	it(
		"GET - tokensAvailable after fund",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensAvailable();
			expect(tokens).to.equal(Number(tokens).noExponents());
		})
	);

	it(
		"should do a non atomic swap on the Contract",
		mochaAsync(async () => {
			console.log("token", tokenPurchaseAmount);
			let res = await swapContract.swap({
				tokenAmount: tokenPurchaseAmount,
			});
			expect(res).to.not.equal(false);
		})
	);

	it(
		"GET - Purchases",
		mochaAsync(async () => {
			let purchases = await swapContract.getPurchaseIds();
			expect(purchases.length).to.equal(1);
		})
	);

	it(
		"GET - My Purchases",
		mochaAsync(async () => {
			let purchases = await swapContract.getAddressPurchaseIds({
				address: app.account.getAddress(),
			});
			expect(purchases.length).to.equal(1);
		})
	);

	it(
		"GET - Purchase ID",
		mochaAsync(async () => {
			let purchases = await swapContract.getAddressPurchaseIds({
				address: app.account.getAddress(),
			});
			let purchase = await swapContract.getPurchase({
				purchase_id: purchases[0],
			});
			expect(Number(purchase.amount).noExponents()).to.equal(
				Number(tokenPurchaseAmount).noExponents()
			);
			expect(purchase.purchaser).to.equal(app.account.getAddress());
			expect(purchase.wasFinalized).to.equal(true);
			expect(purchase.reverted).to.equal(false);
		})
	);

	it(
		"GET - tokensAvailable after Swap",
		mochaAsync(async () => {
			let tokens = await swapContract.tokensAvailable();
			expect(Number(tokens).noExponents()).to.equal(
				Number(tokenFundAmount - tokenPurchaseAmount).noExponents()
			);
		})
	);

	it(
		"GET - Buyers",
		mochaAsync(async () => {
			let buyers = await swapContract.getBuyers();
			expect(buyers.length).to.equal(1);
		})
	);

	it(
		"GET - Fixed Swap is Closed",
		mochaAsync(async () => {
			await delay(15 * 1000);
			let res = await swapContract.hasFinalized();
			expect(res).to.equal(true);
			res = await swapContract.isOpen();
			expect(res).to.equal(false);
		})
	);

	it(
		"Remove ETH From Purchases - Admin",
		mochaAsync(async () => {
			let res = await swapContract.withdrawFunds();
			expect(res).to.not.equal(false);
		})
	);

	it(
		"Remove Unsold Tokens - Admin",
		mochaAsync(async () => {
			let res = await swapContract.withdrawUnsoldTokens();
			expect(res).to.not.equal(false);
		})
	);
});
