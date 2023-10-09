import { useContext, useState } from "react";
import axios from "axios";
import "./FileUpload.css";
import { tezos } from "../utils/tezos";
import { context } from "../App";

// KT1T3m3FarBi44wp8z4KcRUY45NSZGU9QBBJ

const FileUpload = ({account}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  // const [loading, setLoading] = useState(false);
  const {loading,setLoading}=useContext(context);


// https://legacy.smartpy.io/origination?cid=QmVEUE8n8TokdhHofpx9otbfvpDJJEJHZpjrRd4WUgQLTd&k=a7a8229233ce9bc57ee8
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            // pinata_api_key: `ba976f7f1755c3f08e18`,
            pinata_api_key: `ea23e88f2a89ec4317a6`,
            pinata_secret_api_key: `
            12d0d50af9e8be6daa8b94b36dd2c39ae303470fae5532904eb9518e65e78485`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
      
        try{
          const contract = await tezos.wallet.at("KT1T3m3FarBi44wp8z4KcRUY45NSZGU9QBBJ");
          const op =await contract.methods.add(ImgHash).send();
          setLoading(true);
          await op.confirmation(1);
          setLoading(false);
          alert("Successfully Image Uploaded");
          setFileName("No image selected");
          setFile(null);
        }
        catch(err){
          throw err;
        }
     
          
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
      setLoading(false)

    }
    setFileName("No image selected");
    setFile(null);
  };
  
  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0]; //files array of files object
    console.log(data);
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
  };
  return (
    
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
      
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account} 
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image:{fileName}</span>
        <button type="submit" className="upload" disabled = {!file}>
          Upload File
        </button>
        {loading? 
        <div className="Background">
        <div className="loader"></div>
      </div>
        : null}

      </form>
    </div>
  );
};
export default FileUpload;