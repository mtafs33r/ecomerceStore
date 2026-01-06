"use client";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Trash2, Edit, Plus } from "lucide-react";
import "../app/style.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/product");
    const data = await res.json();
    if (data.success) setProducts(data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (values) => {
    const url = editing ? `/api/product/${editing._id}` : "/api/product";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      toast.success(editing ? "Product updated" : "Product added");
      setOpen(false);
      setEditing(null);
      fetchProducts();
    } else toast.error("Operation failed");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/product/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="page-bg">
      {/* HEADER */}
      <div className="header-container">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Product Management</p>
        </div>

        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={18} /> New Product
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="col-center">Price</th>
              <th className="col-center">Qty</th>
              <th className="col-center">Status</th>
              <th className="col-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="font-semibold">{p.name}</td>
                <td className="col-center">${p.price}</td>
                <td className="col-center">{p.quantity}</td>
                <td className="col-center">
                  {p.quantity > 0 ? (
                    <span className="badge-green">Available</span>
                  ) : (
                    <span className="badge-red">Out of Stock</span>
                  )}
                </td>
                <td className="col-right">
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                      className="action-btn edit"
                      title="Edit product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="action-btn delete"
                      title="Delete product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{editing ? "Edit Product" : "Add Product"}</h2>

            <Formik
              initialValues={{
                name: editing?.name || "",
                description: editing?.description || "",
                price: editing?.price || "",
                quantity: editing?.quantity || "",
              }}
              enableReinitialize
              onSubmit={handleSave}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Product Name"
                      className="input"
                      required
                    />

                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="input"
                      rows="4"
                    />

                    <div className="grid-cols-2">
                      <input
                        type="number"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="input"
                        min="0"
                        step="0.01"
                        required
                      />
                      <input
                        type="number"
                        name="quantity"
                        value={values.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setEditing(null);
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editing ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
