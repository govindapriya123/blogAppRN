import EncryptedStorage from "react-native-encrypted-storage";
export const setItemAsync=async(key:string,value:string)=>{
    try{
        console.log("🔹 Storing Key:", key, "Value:", value);
        await EncryptedStorage.setItem(key,JSON.stringify(value));
        console.log('set Item saved successfully');
    }catch(error){
        console.error('setItemAsync',error,key,value);
    }
};
export const getItem=async(key:string)=>{
    try{
      const value=await EncryptedStorage.getItem(key);
      console.log("🔑 Retrieved Key:", key, "Value:", value);
      return value?JSON.parse(value):null;
    }catch(error){
     console.error('Error retriving key value',error);
     return null;
    }
};
export const removeItem=async(key:string)=>{
    try{
        await EncryptedStorage.removeItem(key);
        console.log('removing item successfully');
    }catch(error){
        console.error('error removing key',error);
    }
}