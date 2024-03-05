import { useContext, useState, createContext} from "react";

const Auth2Context = createContext();
const Auth2Provider = ({children}) =>{
    const [hasRole, setHasRole] = useState(false);
    return(
        <Auth2Context.Provider value={[hasRole, setHasRole]}>
            {children}
        </Auth2Context.Provider>
    );
};

//custom hook
const useSearch =()=> useContext(Auth2Context); 
export{useSearch,Auth2Provider};