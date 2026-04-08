import { useState, useEffect } from "react";
import API from "../services/api";

function Home() {
  const [form, setForm] = useState({
    type: "income",
    description: "",
    amount: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    type: "all",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });

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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: "all", dateFrom: "", dateTo: "", amountMin: "", amountMax: "" });
    setPage(1);
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
      if (filters.type !== "all") url += `&type=${filters.type}`;
      if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
      if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;
      if (filters.amountMin) url += `&amountMin=${filters.amountMin}`;
      if (filters.amountMax) url += `&amountMax=${filters.amountMax}`;

      const res = await API.get(url);
      setTransactions(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const filteredTransactions = transactions.filter((t) => {
    const txDate = new Date(t.createdAt);
    if (filters.dateFrom && txDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && txDate > new Date(filters.dateTo + "T23:59:59")) return false;
    if (filters.amountMin && t.amount < Number(filters.amountMin)) return false;
    if (filters.amountMax && t.amount > Number(filters.amountMax)) return false;
    return true;
  });

  const activeFilterCount = [
    filters.type !== "all",
    filters.dateFrom,
    filters.dateTo,
    filters.amountMin,
    filters.amountMax,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">

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

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-700">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min Amount (₹)</label>
            <input
              type="number"
              name="amountMin"
              placeholder="0"
              value={filters.amountMin}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Amount (₹)</label>
            <input
              type="number"
              name="amountMax"
              placeholder="∞"
              value={filters.amountMax}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>
      </div>

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

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No transactions found.</p>
        ) : (
          filteredTransactions.map((t) => (
            <div
              key={t._id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-xs text-gray-400">
                  {new Date(t.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                  {" · "}
                  <span className={t.type === "income" ? "text-green-500" : "text-red-500"}>
                    {t.type}
                  </span>
                </p>
              </div>
              <span className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                ₹{t.amount}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
