import { useContext, useState, createContext} from "react";

const CartContext = createContext();
const CartProvider = ({children}) =>{
    const [cart, setCart] = useState({ items: [] });
    return(
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
};

//custom hook
const useCart =()=> useContext(CartContext); 
export{useCart,CartProvider};