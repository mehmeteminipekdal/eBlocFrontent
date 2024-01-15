import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './USD.module.css'
import SecondAbi from './Contracts/SecondAbi.json'
import Interactions from './SecondContractInteractions';

const SecondContract = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0xA645bf3cD3dc750329C3251f0A04d5373AeC7D71';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tokenName, setTokenName] = useState("Token");
	const [balance, setBalance] = useState(null);
	const [transferHash, setTransferHash] = useState(null);

	const [decimals, setDecimals] = useState(null);
	const [symbol, setSymbol] = useState(null);
	const [totalSupply, setTotalSupply] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				console.log(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {

		setDefaultAccount(newAccount);
		updateEthers();
	}

	const updateBalance = async () => {
		try{
			// let balanceBigN = await contract.balanceOf(defaultAccount);
			
			// let balanceNumber = Number(balanceBigN);
			//let balanceNumber = ethers.BigNumber.toNumber(balanceBigN)

			// let tokenDecimals = Number(await contract.decimals());

			// let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

			// setBalance(toFixed(tokenBalance));	
			// setDecimals(tokenDecimals);
			setSymbol(await contract.symbol());
			setTotalSupply(Number(await contract.totalSupply()));

			}catch(error){
					console.log(error.message);
			}

	}

   function toFixed(x) {
   if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
         x *= Math.pow(10, e - 1);
         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
   } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
         e -= 20;
         x /= Math.pow(10, e);
         x += (new Array(e + 1)).join('0');
      }
   }
   return x;
}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = async () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);
	  
		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);
	  
		let tempContract = new ethers.Contract(contractAddress, SecondAbi, tempSigner); // Added for the second contract
	  
		setContract(tempContract);  
	  }

	  useEffect(() => {
		window.ethereum.on('accountsChanged', accountChangedHandler);
		window.ethereum.on('chainChanged', chainChangedHandler);
	  
		// Cleanup listeners on unmount
		return () => {
		  window.ethereum.removeListener('accountsChanged', accountChangedHandler);
		  window.ethereum.removeListener('chainChanged', chainChangedHandler);
		};
	  }, []); // The empty array ensures this effect only runs once on mount
	  
	  
	return (
	<div>
			<h2> {"SecondContract Broker - Wallet Connection"} </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			<div className={styles.walletCard}>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div>
				<h3>Address of the Contract: {contractAddress}</h3>
			</div>

			{errorMessage}
		</div>
		<Interactions contract = {contract} provider = {provider}/>

	</div>
	)
}

export default SecondContract;