// TODO 6 - Call add entrypoint in the storage contract
import {tezos} from "./tezos"

export const addOperation = async (ImgHash) => {
    try{
        console.log(ImgHash)
        const contract = await tezos.wallet.at("KT1T3m3FarBi44wp8z4KcRUY45NSZGU9QBBJ");
        const op =await contract.methods.add(ImgHash).send()
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

