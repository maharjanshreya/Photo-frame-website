import { useContext, useState, createContext} from "react";

const UploadContext = createContext();
const UploadProvider = ({children}) =>{
    const [upload, setUpload] = useState([]);
    return(
        <UploadContext.Provider value={{upload, setUpload}}>
            {children}
        </UploadContext.Provider>
    );
};

//custom hook
const useUpload =()=> useContext(UploadContext); 
export{useUpload,UploadProvider};