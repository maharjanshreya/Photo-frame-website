import { useContext, useState, createContext} from "react";

const WishlistContext = createContext();
const WishlistProvider = ({children}) =>{
    const [wishlists, setWishlists] = useState([]);
    return(
        <WishlistContext.Provider value={{wishlists, setWishlists}}>
            {children}
        </WishlistContext.Provider>
    );
};

//custom hook
const useWishlist =()=> useContext(WishlistContext); 
export{useWishlist,WishlistProvider};