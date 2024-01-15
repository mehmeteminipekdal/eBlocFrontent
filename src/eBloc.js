import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './USD.module.css'
import EBlocAbi from './Contracts/EBlocAbi.json'
import SecondAbi from './Contracts/SecondAbi.json'
import Interactions from './eBlocInteractions';

const EBloc = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x00A7413ACb69D7F9a03ab92B77c49628bD340274';
	let secondContractAddress = '0xA645bf3cD3dc750329C3251f0A04d5373AeC7D71';
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [signer, setSigner] = useState(null);
	const [provider, setProvider] = useState(null);
	const [contract, setContract] = useState(null);
	const [secondContract, setSecondContract] = useState(null); // Added for the second contract


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
	  
		let tempContract = new ethers.Contract(contractAddress, EBlocAbi, tempSigner);
		let tempSecondContract = new ethers.Contract(secondContractAddress, SecondAbi, tempSigner); // Added for the second contract
	  
		setContract(tempContract);  
		setSecondContract(tempSecondContract); // Added for the second contract
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
			<h2> {"EBloc Broker - Wallet Connection"} </h2>
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
		<Interactions contract = {contract} secondContract={secondContract} provider = {provider}/>

	</div>
	)
}

export default EBloc;