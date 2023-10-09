
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
const Meta = () => {
   
	const connectWallet = async () => {
		if (window.ethereum === undefined) {
			alert("Metamask is not installed, please install metamask");
		} else {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			alert("Metamask connected successfully");
			console.log(accounts[0]);
		}
	};

	return (
		<div>
		  <IconButton aria-label="fingerprint" color="success" onClick={connectWallet}>
               <Fingerprint />
                 </IconButton>
		
		</div>
	);
};
export default Meta;