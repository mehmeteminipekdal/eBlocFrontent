import { React, useState } from 'react';
import styles from './USD.module.css';
import Web3 from 'web3';
import {ethers} from 'ethers'


// And later in the code
const web3 = new Web3(window.ethereum);


const EBlocInteractions = (props) => {
  const { contract, secondContract, provider } = props;

  const [resultString, setResultString] = useState('');
  const [operation, setOperation] = useState('');
  const [selectedProviders, setSelectedProviders] = useState({});
  const [textBoxValues, setTextBoxValues] = useState({});

  const handleCheckboxChange = (provider) => {
    setSelectedProviders(prevSelectedProviders => ({
      ...prevSelectedProviders,
      [provider]: !prevSelectedProviders[provider]
    }));
  };

// Update the text box values when they change
const handleTextBoxChange = (provider, name, value) => {
	setTextBoxValues(prevTextBoxValues => ({
		...prevTextBoxValues,
		[provider]: {
		...(prevTextBoxValues[provider] || {}),
		[name]: value
		}
	}));
	};

  const doesProviderExistHandler = async (e) => {
    e.preventDefault();
    setOperation('doesProviderExistHandler');
    setResultString('Waiting...');
    try {
      let txt = await contract.doesProviderExist(e.target.provider.value);
      setResultString(txt.toString());
    } catch (error) {
      const errorMessage = error.message.toString();
      const match = errorMessage.match(/reason="([^"]*)"/);
      const extractedErrorMessage = match ? match[1] : errorMessage;
      setResultString(extractedErrorMessage);
    }
  };

  const doesRequesterExistHandler = async (e) => {
    e.preventDefault();
    setOperation('doesRequesterExistHandler');
    setResultString('Waiting...');
    try {
      let txt = await contract.doesRequesterExist(e.target.requester.value);
      setResultString(txt.toString());
    } catch (error) {
      const errorMessage = error.message.toString();
      const match = errorMessage.match(/reason="([^"]*)"/);
      const extractedErrorMessage = match ? match[1] : errorMessage;
      setResultString(extractedErrorMessage);
    }
  };

  const getProviderInfoHandler = async (currentProvider) => {
    try {
      // Create an array of promises
      let promises = [0, 1, 2, 3, 4, 5].map((i) => secondContract.getProviderInfo(currentProvider, i));

      // Use Promise.all to wait for all promises to resolve
      let txt = await Promise.all(promises);

      console.log(txt);
      console.log(txt.toString());
      return txt.join(',');
    } catch (error) {
      const errorMessage = error.message.toString();
      const match = errorMessage.match(/reason="([^"]*)"/);
      const extractedErrorMessage = match ? match[1] : errorMessage;
      return extractedErrorMessage;
    }
  };
  
  const getProvidersHandler = async (e) => {
    e.preventDefault();
    setOperation('getProvidersHandler');
    setResultString('Waiting...');

	try {
		let providersArray = await contract.getProviders();
		let providersDetails = await Promise.all(
		  providersArray.map(provider => getProviderInfoHandler(provider))
		);
			
		const tableRows = providersDetails.map((details, index) => {
		const provider = providersArray[index];
		return (
		<tr key={provider}>
		<td>
		<input
		type="checkbox"
		checked={selectedProviders[provider] || false}
		onChange={() => handleCheckboxChange(provider)}
		/>
		</td>
		<td>{provider}</td>
		{details.split(',').map((detail, idx) => (
		<td key={idx}>{detail}</td>
		))}
		</tr>
		);
		});
		
		setResultString(
		<>
		<table className={styles.providersTable}>
		<thead>
		<tr>
		<th>Select</th>
		<th>Provider</th>
		<th>Available Core</th>
		<th>Commitment Block Duration</th>
		<th>Price per Core Minute</th>
		<th>Price Data Transfer</th>
		<th>Price Storage</th>
		<th>Price Cache</th>
		</tr>
		</thead>
		<tbody>{tableRows}</tbody>
		</table>
		<button onClick={submitJobHandler} className={styles.button6}>
		Select Job
		</button>
		</>
		);
	
    } catch (error) {
      const errorMessage = error.message.toString();
      const match = errorMessage.match(/reason="([^"]*)"/);
      const extractedErrorMessage = match ? match[1] : errorMessage;
      setResultString(extractedErrorMessage);
    }
  };

  // Use the data from textBoxValues to submit jobs
  const submitJobHandler = async () => {
    for (const selectedProviderArray of Object.keys(selectedProviders)) {
		// Create an array of promises
		let promises = [0, 1, 2, 3, 4, 5].map((i) => secondContract.getProviderInfo(selectedProviderArray, i));

		// Use Promise.all to wait for all promises to resolve
		let providerData = await Promise.all(promises);

		const textBoxData = textBoxValues[selectedProviderArray] || {};

		let isProviderNull = selectedProviderArray;

        if (!isProviderNull || !providerData[0]) continue; // or handle error

        const dataTransferIn = parseInt(textBoxData.DataTransferIn, 10 );


        const cores = parseInt(textBoxData.Cores, 10 );
        const runTime = parseInt(textBoxData.RunTime, 10 );
        const dataTransferOut = parseInt(textBoxData.DataTransferOut, 10 );

        const jobPrice = 
		 providerData[2].toString() * 10 + 
          10 * providerData[5].toString() + 
          (10 + 11) * providerData[3].toString();
        
        const jobPricee = parseInt(jobPrice.toString(), 10 );

        const args = {
          provider: selectedProviderArray,
          priceBlockIndex: 0, // assuming this is static
          cloudStorageID: [0], // assuming this is static
          cachetype: [0], // assuming this is static
          dataPricesSetBlockNum: [0], // assuming this is static
          core: [1],
          runTime: [10],
          dataTransferOut: dataTransferOut || 0,
          jobPrice: jobPricee,
          workflowId: 0 // assuming this is static
        };

        try {
          const padded = ethers.utils.hexZeroPad(0x00, 32);

          // Convert args to the required types
          const contractArgs = {
            key: padded.toString(),
            dataTransferIn: [dataTransferIn || 0],
            args:
              [
                args.provider,
                args.priceBlockIndex,
                args.cloudStorageID,
                args.cachetype,
                args.dataPricesSetBlockNum,
                args.core,
                args.runTime,
                args.dataTransferOut,
                args.jobPrice,
                args.workflowId
              ],
            storageDuration: [0], // assuming this is static
            sourceCodeHash: [padded]
          };
      
      console.log("key", contractArgs.key);
      console.log("dataTransferIn", contractArgs.dataTransferIn);
      console.log("args.provider", args.provider);
      console.log("args.priceBlockIndex", args.priceBlockIndex);
      console.log("args.cloudStorageID", args.cloudStorageID);
      console.log("args.cachetype", args.cachetype);
      console.log("args.dataPricesSetBlockNum", args.dataPricesSetBlockNum);
      console.log("args.core", args.core);
      console.log("args.runTime", args.runTime);
      console.log("args.dataTransferOut", args.dataTransferOut);
      console.log("args.jobPrice", args.jobPrice);
      console.log("args.workflowId", args.workflowId);
      
      console.log("args", contractArgs.args);
      console.log("storageDuration", contractArgs.storageDuration);
      console.log("sourceCodeHash", contractArgs.sourceCodeHash);
		  const result = await contract.submitJob(
			contractArgs.key,
			contractArgs.dataTransferIn,
			contractArgs.args,
			contractArgs.storageDuration,
			contractArgs.sourceCodeHash
		  ); // user's Metamask address
		console.log(result);
        } catch (error) {
          console.error('Error submitting job for 0x06FFb2c253450680d8614524466740f9576ED93F', error);
        }
      
    }
  };

  const getJobInfoHandler = async (provider, key, index, jobID) => {
	setOperation('getJobInfoHandler');
	setResultString('Waiting...');
	try {
	  // You need to convert index and jobID from string to their respective types
	  const parsedIndex = parseInt(index, 10);
	  const parsedJobID = parseInt(jobID, 10);
	  console.log("provider", provider);
	  console.log("key", key);
	  console.log("parsedIndex", parsedIndex);
	  console.log("parsedJobID", parsedJobID);
	  let txt = await contract.getJobInfo(provider, key, parsedIndex, parsedJobID);
	  setResultString(JSON.stringify(txt)); // Assuming you want to display the returned object as a string
	} catch (error) {
	  const errorMessage = error.message.toString();
	  const match = errorMessage.match(/reason="([^"]*)"/);
	  const extractedErrorMessage = match ? match[1] : errorMessage;
	  setResultString(extractedErrorMessage);
	}
  };

    const registerRequesterHandler = async (e) => {
      e.preventDefault();
      setOperation('registerRequesterHandler');
      setResultString('Waiting...');
      try {
        const padded = ethers.utils.hexZeroPad(0x000, 32)
        let txt = await contract.registerRequester(padded, "alper.alimoglu@gmail.com", "ee14ea28-b869-1036-8080-9dbd8c6b1579@b2drop.eudat.eu", "/ip4/79.123.177.145/tcp/4001/ipfs/QmWmZQnb8xh3gHf9ZFmVQC4mLEav3Uht5kHJxZtixG3rsf");
        console.log("Returns:", txt.toString());
        console.log("Returns:", txt);

        setResultString(txt.toString());
      } catch (error) {
        const errorMessage = error.message.toString();
        const match = errorMessage.match(/reason="([^"]*)"/);
        const extractedErrorMessage = match ? match[1] : errorMessage;
        setResultString(extractedErrorMessage);
      }
    };


  return (
    <div className={styles.walletCard}>
      <form onSubmit={doesProviderExistHandler}>
        <h3> Does Provider Exist </h3>
        <p> Provider Address </p>
        <input type='text' id='provider' className={styles.addressInput} />
        <button type='submit' className={styles.button6}>
          Get
        </button>
        <div>{operation === 'doesProviderExistHandler' ? resultString : ''}</div>
      </form>
      <form onSubmit={doesRequesterExistHandler}>
        <h3> Does Requester Exist </h3>
        <p> Requester Address </p>
        <input type='text' id='requester' className={styles.addressInput} />
        <button type='submit' className={styles.button6}>
          Get
        </button>
        <div>{operation === 'doesRequesterExistHandler' ? resultString : ''}</div>
      </form>
      <form onSubmit={getProvidersHandler}>
        <h3> Get Providers </h3>
        <button type='submit' className={styles.button6}>
          Get
        </button>
        <div>{operation === 'getProvidersHandler' ? resultString : ''}</div>
		{Object.entries(selectedProviders).filter(([_, isSelected]) => isSelected).map(([provider]) => (
        <div key={provider}>
          <input type="text" placeholder="IPFS Hash" onChange={e => handleTextBoxChange(provider, 'IPFS_hash', e.target.value)} />
          <input type="number" placeholder="Data Transfer In" onChange={e => handleTextBoxChange(provider, 'DataTransferIn', e.target.value)} />
          <input type="number" placeholder="Cores" onChange={e => handleTextBoxChange(provider, 'Cores', e.target.value)} />
          <input type="number" placeholder="Run Time" onChange={e => handleTextBoxChange(provider, 'RunTime', e.target.value)} />
          <input type="number" placeholder="Data Transfer Out" onChange={e => handleTextBoxChange(provider, 'DataTransferOut', e.target.value)} />
        </div>
      ))}
		{operation === 'getProvidersHandler' && (
		<button type="button" onClick={submitJobHandler} className={styles.button6}>
		Submit Job
		</button>
		)}
      </form>
	  <form onSubmit={(e) => {
  e.preventDefault();
  const provider = e.target.provider.value;
  const key = e.target.key.value;
  const index = e.target.index.value;
  const jobID = e.target.jobID.value;
  getJobInfoHandler(provider, key, index, jobID);
}}>
  <h3> Get Job Info </h3>
  <input type="text" name="provider" placeholder="Provider" className={styles.addressInput} />
  <input type="text" name="key" placeholder="IPFS Hash" className={styles.textBox} />
  <input type="number" name="index" placeholder="index" className={styles.textBox} />
  <input type="text" name="jobID" placeholder="jobID" className={styles.textBox} />
  <button type='submit' className={styles.button6}>
    Get
  </button>
  <div>{operation === 'getJobInfoHandler' ? resultString : ''}</div>
</form>
<form onSubmit={registerRequesterHandler}>
        <h3> Register Requester </h3>
        <p> IPFS Hash </p>
        <input type='text' id='ipfshash' className={styles.addressInput} />
        <button type='submit' className={styles.button6}>
          Request
        </button>
        <div>{operation === 'registerRequesterHandler' ? resultString : ''}</div>
      </form>
    </div>
  );
};

export default EBlocInteractions;
