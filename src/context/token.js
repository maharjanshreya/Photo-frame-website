import { useContext, useState, createContext, useEffect} from "react";

const AuthContext = createContext();
const AuthProvider = ({children}) =>{
    const [auth, setAuth] = useState({
        user: null,
        token:"",
    });
    useEffect(()=>{
        const data = localStorage.getItem("tokens");
        if(data){
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.email,
                token: parseData.token
            });
        }
    },[auth]);
    return(
        <AuthContext.Provider value={[auth, setAuth ]}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook

const useAuth = () => useContext(AuthContext);
  
export{useAuth,AuthProvider};