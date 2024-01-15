import {React, useState} from 'react'
import styles from './USD.module.css';

const SecondContractInteractions = (props) => {
	const {contract, provider} = props;

	const [resultString, setResultString] = useState("");
	const [operation, setOperation] = useState("");

	const getProviderInfoHandler = async (e) => {
		e.preventDefault();
		setOperation("getProviderInfoHandler");
		setResultString("Waiting...");
		
		try {
			let provider = e.target.provider.value;
			let pr = [];
	
			// Create an array of promises
			let promises = [0, 1, 2, 3, 4, 5].map(i => contract.getProviderInfo(provider, i));
	
			// Use Promise.all to wait for all promises to resolve
			let txt = await Promise.all(promises);
	
			console.log(txt);
			console.log(txt.toString());
			setResultString(txt.toString());
		} catch (error) {
			const errorMessage = error.message.toString();
			const match = errorMessage.match(/reason="([^"]*)"/);
			const extractedErrorMessage = match ? match[1] : errorMessage;
			setResultString(extractedErrorMessage);
		}
	}
	
	return (
			<div className={styles.interactionsCard}>
				<form onSubmit={getProviderInfoHandler}>
					<h3> Get Provider Info </h3>
						<p> Provider Address </p>
						<input type='text' id='provider' className={styles.addressInput}/>
						<button type='submit' className={styles.button6}>Get</button>
						<div>
							{operation === "getProviderInfoHandler" ? resultString : ""}
						</div>
				</form>
			</div>
		)
	
}

export default SecondContractInteractions;