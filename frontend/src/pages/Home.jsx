import { useState, useEffect } from "react";
import API from "../services/api";

function Home() {
  const [form, setForm] = useState({
    type: "income",
    description: "",
    amount: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transactions", form);
      setForm({ type: "income", description: "", amount: "" });
      fetchTransactions();
    } catch {
      alert("Error adding transaction");
    }
  };

  const fetchTransactions = async () => {
    try {
      let url = `/transactions?page=${page}&limit=5`;

      if (filter !== "all") {
        url += `&type=${filter}`;
      }

      const res = await API.get(url);
      setTransactions(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filter]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-black">
         Finance Tracker
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3>Income</h3>
          <p className="text-green-600 font-bold text-xl">₹{totalIncome}</p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow text-center">
          <h3>Expense</h3>
          <p className="text-red-600 font-bold text-xl">₹{totalExpense}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3>Balance</h3>
          <p className="text-blue-600 font-bold text-xl">₹{balance}</p>
        </div>
      </div>

      {/* FILTER */}
      <select
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
        className="mb-4 p-2 border rounded"
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Add Transaction
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {transactions.map((t) => (
          <div
            key={t._id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <span>{t.description}</span>
            <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
              ₹{t.amount}
            </span>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;