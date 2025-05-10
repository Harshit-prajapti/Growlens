"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Sale {
  _id?: string;
  productId: Product;
  quantitySold: number;
  revenue: number;
  totalProfit : number;
  date: string;
  product : {name : string,category : string,price : number,profit : number}
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setLoading(false);
      setProducts(res.data);

    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get("/api/sales");
      console.log("This is the fetchSales res : ",res)
      setSales(res.data);
    } catch {
      toast.error("Failed to fetch sales");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const handleSubmit = async () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error("Please select a product and enter quantity");
      return;
    }

    try {
     const res =  await axios.post("/api/sales", {
        productId: selectedProduct._id,
        quantitySold: quantity,
      });
      console.log("This is the response : ",res)
      toast.success("Sale recorded");
      setQuantity(0);
      setSelectedProduct(null);
      fetchSales();
    } catch {
      toast.error("Failed to record sale");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Daily Sales Entry</h1>

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div>
            <Label className="mb-2">Select Product</Label>
            <Select
              value={selectedProduct?._id}
              onValueChange={(value) => {
                const prod = products.find((p) => p._id === value);
                setSelectedProduct(prod || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Quantity Sold</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <Label className="mb-2">Auto Revenue ($)</Label>
            <Input value={selectedProduct ? selectedProduct.price * quantity : 0} disabled />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button className="cursor-pointer" onClick={handleSubmit}>Add Sale</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Sales</h2>
        {sales.length === 0 && <p className="text-gray-500">No sales recorded yet.</p>}
        {loading && (<Loader2 className="animate-spin text-blue-500" size={24} />)}
        {sales.map((sale) => (
          <Card key={sale._id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="font-medium">{sale.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {sale.quantitySold}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-blue-600 font-semibold">{sale.product.category.toUpperCase()}</h2>
                <p className="text-sm text-gray-500">Price: ${sale.product.price}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600">${sale.revenue}</p>
                <p className="text-xs text-gray-400">{new Date(sale.date).toDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
