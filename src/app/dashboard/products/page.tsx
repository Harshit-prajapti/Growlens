'use client'
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import z from "zod"
interface Product {
  _id?: string;
  name: string;
  category?: string;
  price: number;
  profit?: number;
}
const schema = z.object({
  name : z.string().nonempty("Name must be required"),
  category : z.string().nonempty("Category must be required"),
  price : z.string().min(1,"Price must be greater than 0"),
  profit : z.string().min(0,"Profit must be greater than or equal to 0")
})
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ name: "", category: "", price: 0, profit : 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error,setError] = useState<string>("")

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      console.log("This is the resonse form the get ", res)
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to fetch products");
    } 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("")
    const validation = schema.safeParse(form)
    if(!validation.success){
      setError(validation.error.errors[0].message)
      return
    }
    try {
      if (editingId) {
        const id = editingId
        const res = await axios.put(`/api/products/${id}`, form);
        console.log(res)
        toast.success("Product updated");
        setEditingId(null);
      } else {
        const res = await axios.post("/api/products", form);
        console.log("this is the response form the post route",res)
        toast.success("Product added");
      }
      setForm({ name: "", category: "", price: 0,profit : 0 });
      fetchProducts();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product._id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Product deleted"); 
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <Card className="mb-8">
        <CardContent className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4 py-6">
          <div className="gap-2">
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" />
          </div>
          <div>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
          </div>
          <div>
            <Label>Price ($)</Label>
            <Input type="number" name="price" value={form.price} onChange={handleChange} />
          </div>
          <div>
            <Label>Profit ($)</Label>
            <Input type="number" name="profit" value={form.profit} onChange={handleChange} placeholder="On a unit"/>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="md:col-span-3 flex justify-end">
            <Button className="cursor-pointer" onClick={handleSubmit}>{editingId ? "Update" : "Add"} Product</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {products.length === 0 && <p className="text-gray-500">No products added yet.</p>}
        {products.map((product) => (
          <Card key={product._id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">{product.category || "Uncategorized"}</p>
              <p className="text-sm">${product.price}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => handleEdit(product)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" className="cursor-pointer" onClick={() => handleDelete(product._id!)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
