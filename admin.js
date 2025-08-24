async function loadOrders() {
  try {
    const res = await fetch('/orders');  // server.js से orders.json fetch करेगा
    const orders = await res.json();

    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = ''; // पहले साफ करो

    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.table}</td>
        <td>${order.items.map(i => `${i.name} (x${i.qty})`).join(", ")}</td>
        <td>${order.total}</td>
        <td>${order.time}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading orders:", err);
  }
}

// हर 5 सेकंड में refresh
setInterval(loadOrders, 5000);

// पहली बार load
loadOrders();
