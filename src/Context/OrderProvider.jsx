import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OrderContext from "./OrderContext";


const storage = "orderHistory";

const OrderProvider = ({ children }) => {
    const latestOrder = useSelector((state) => state.orders.latest);
    const [allOrder, setAllOrder] = useState(() => {
        const saved = localStorage.getItem(storage);
        return saved ? JSON.parse(saved) : [];
    });


    useEffect(() => {
      if (latestOrder) {
        setAllOrder((prev) => {
          const exists = prev.some((o) => o.va === latestOrder.va);
            if (exists) return prev; 
            
          const updated = [...prev, latestOrder];
          localStorage.setItem(storage, JSON.stringify(updated));
          return updated;
        });
      }
    }, [latestOrder]);

    useEffect(() => {
        localStorage.setItem(storage, JSON.stringify(allOrder));
    }, [allOrder]);


  return (
    <OrderContext.Provider value={{ allOrder, setAllOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
