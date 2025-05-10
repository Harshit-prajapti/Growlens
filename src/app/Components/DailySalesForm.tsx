"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
interface Pro {
    _id : string,
    price : number,
    name : string,
    profit : string
}
const DailySalesForm = ({ businessId }: { businessId: string }) => {
  const [products, setProducts] = useState<Pro[]>([]);
  const [entries, setEntries] = useState<
    { productId: string; quantity: number }[]
  >([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`/api/products?businessId=${businessId}`);
      setProducts(res.data);
    };
    fetchProducts();
  }, [businessId]);

  const handleSubmit = async() => {
    for(const entry of entries){
        const product = products.find((p)=> p._id === entry.productId)
        let revenue = 0;
        if(product?.price){
          revenue = product.price * entry.quantity
        }        
        await axios.post(`/api/daily-sales`,{
            businessId,
            productId : entry.productId,
            quatitySold : entry.quantity,
            revenue,
        });
    }
    alert("sales submitted")
    setEntries([]);
  }
  return(
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Daily Sales Entry</h2>

      {products.map((product) => (
        <div key={product._id} className="flex items-center gap-4">
          <p className="w-1/3">{product.name}</p>
          <input
            type="number"
            className="border px-2 py-1 rounded w-1/3"
            placeholder="Quantity Sold"
            onChange={(e) =>
              setEntries((prev) => {
                const existing = prev.find((ent) => ent.productId === product._id);
                if (existing) {
                  return prev.map((ent) =>
                    ent.productId === product._id ? { ...ent, quantity: +e.target.value } : ent
                  );
                } else {
                  return [...prev, { productId: product._id, quantity: +e.target.value }];
                }
              })
            }
          />
        </div>
      ))}

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Sales
      </button>
    </div>
  )
};

export default DailySalesForm;
