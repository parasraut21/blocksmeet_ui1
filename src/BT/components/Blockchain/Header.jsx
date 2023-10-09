import React, { useEffect, useState } from 'react'
import {
    connectWallet,
    getAccount,
    disconnect
  } from "../utils/wallet";


const Header = () => {
  const [account,setAccount]=useState('')

  useEffect(()=>{
    (async()=>{
        
        const account = await getAccount();
        setAccount(account);
        
       
        
    })()

  },[])

  const onConnectWallet=async ()=>{
    await connectWallet();
    const account = await getAccount();
    console.log(account)
    setAccount(account);

    
  }

  const onDisconnectWallet = async () => {
    console.log(`DEBUG:Disconnect Wallet`);
    disconnect();
    setAccount("Not Connected");
  }
  return (

    <header className="w-full text-gray-700 bg-black flex justify-center  border-gray-100 shadow-sm body-font">
    <div className=" flex flex-col  items-center p-3 w-full md:flex-row">

        <nav className="flex flex-wrap order-first items-center text-base lg:w-1/2  md:ml-auto">
           

          

        </nav>
      
        <div className="inline-flex items-center h-full ml-5 lg:w-2/5 lg:justify-end lg:ml-0">
            <a href="#_"
                onClick={ onConnectWallet}
                className="px-4 py-2 text-xs font-bold  text-white font-montserrat  transition-all duration-150 bg-red-700 rounded shadow outline-none active:bg-red-100 hover:shadow-md focus:outline-none ease">
                {account?account:'Connect'}
        
                
            </a>

            <a href="#_"
                onClick={onDisconnectWallet}
                className="px-4 py-2 text-xs font-bold  text-white font-montserrat  transition-all duration-150 bg-red-700 rounded shadow outline-none active:bg-red-100 hover:shadow-md focus:outline-none ease">
                Disconnect
        
                
            </a>

        </div>
    </div>
</header>

    
    
  
  )
}

export default Header

// import "../index.css";
// import {
//   connectWallet,
//   getActiveAccount,
//   disconnectWallet,
// } from "../utils/wallet";
// import { useEffect, useState } from "react";

// export default function Header() {
//   const [wallet, setWallet] = useState(null);

//   const handleConnectWallet = async () => {
//     console.log("hit")
//     const { wallet } = await connectWallet();
//     console.log(wallet);
//     setWallet(wallet);
//   };
//   const handleDisconnectWallet = async () => {
//     const { wallet } = await disconnectWallet();
//     setWallet(wallet);
//   };

//   useEffect(() => {
//     const func = async () => {
//       const account = await getActiveAccount();
//       if (account) {
//         setWallet(account.address);
//       }
//     };
//     func();
//   }, []);

//   return (
//     <nav className="bg-gray-800 h-14 flex items-center px-10 justify-between">
//       <div className="flex-1 space-x-4">
//         <a href="#!" className="font-bold text-white pr-6">
//           ICON HERE
//         </a>
//         <a
//           href="#!"
//           className="bg-black text-gray-200 px-4 py-2 text-sm font-semibold rounded-sm"
//         >
//           Home
//         </a>
//         <a
//           href="#!"
//           className="cursor-pointer text-gray-300 px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-700 hover:text-gray-200"
//         >
//           Mint
//         </a>
//         <a
//           href="#!"
//           className="cursor-pointer text-gray-300 px-4 py-2 text-sm font-semibold rounded-sm hover:bg-gray-700 hover:text-gray-200"
//         >
//           About
//         </a>
//       </div>
//       <div>
//         <button
//           onClick={wallet ? handleDisconnectWallet : handleConnectWallet}
//           className="bg-red-500 px-6 py-2 rounded-sm text-xs font-semibold text-white cursor-pointer"
//         >
//           💳{" "}
//           {wallet
//             ? wallet.slice(0, 4) +
//               "..." +
//               wallet.slice(wallet.length - 4, wallet.length)
//             : "Connect"}
//         </button>
//       </div>
//     </nav>
//   );
// }
