const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// 📌 Get all orders
app.get("/api/orders", (req, res) => {
  fs.readFile(path.join(__dirname, "orders.json"), "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read orders" });
    const orders = JSON.parse(data || "[]");
    res.json(orders);
  });
});

// 📌 Save new order
app.post("/api/orders", (req, res) => {
  const newOrder = {
    table: req.body.table || "Unknown",
    items: req.body.items || [],
    total: req.body.total || 0,
    time: new Date().toISOString()
  };

  // Read existing orders
  fs.readFile(path.join(__dirname, "orders.json"), "utf-8", (err, data) => {
    let orders = [];
    if (!err && data) {
      orders = JSON.parse(data);
    }

    // Add new order
    orders.push(newOrder);

    // Save back
    fs.writeFile(
      path.join(__dirname, "orders.json"),
      JSON.stringify(orders, null, 2),
      (err) => {
        if (err) return res.status(500).json({ error: "Failed to save order" });
        res.json({ message: "Order saved successfully", order: newOrder });
      }
    );
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

