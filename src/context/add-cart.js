import { useContext, useState, createContext} from "react";

const AddCartContext = createContext();
const AddCartProvider = ({children}) =>{
    const [isAdded, setIsAdded] = useState(false);
    return(
        <AddCartContext.Provider value={{isAdded, setIsAdded }}>
            {children}
        </AddCartContext.Provider>
    );
};

//custom hook

const useCart = () => {
    return useContext(AddCartContext);
  };
export{useCart,AddCartProvider};