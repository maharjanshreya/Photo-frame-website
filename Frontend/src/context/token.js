import { useContext, useState, createContext} from "react";

const AuthContext = createContext();
const AuthProvider = ({children}) =>{
    const [hasToken, setHasToken] = useState(false);
    return(
        <AuthContext.Provider value={[hasToken, setHasToken]}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook
const useAuth =()=> useContext(AuthContext); 
export{useAuth,AuthProvider};