import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const Admin = ({ onLogout }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [withdrawn, setWithdrawn] = useState(0);
  const [newWithdrawn, setNewWithdrawn] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(`${API_URL}/all-orders`);
        if (ordersRes.data.success) {
          const updatedOrders = ordersRes.data.orders.map((order) => ({
            ...order,
            status: order.status || "In Progress",
            paidAmount: order.paidAmount || 0,
            dueAmount: order.dueAmount || 0,
          }));
          setOrders(updatedOrders);
        }

        const withdrawnRes = await axios.get(`${API_URL}/withdrawn-amount`);
        if (withdrawnRes.data.success) {
          setWithdrawn(withdrawnRes.data.amount);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (onLogout) onLogout();
    navigate("/");
  };
  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
  };

  const handleAmountChange = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][field] = Number(value);
    setOrders(updatedOrders);
  };

  const saveOrder = async (order) => {
    try {
      const res = await axios.put(`${API_URL}/update-order/${order._id}`, {
        status: order.status,
        paidAmount: order.paidAmount,
        dueAmount: order.dueAmount,
      });

      if (res.data.success) {
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order.");
      }
    } catch (err) {
      alert("Error updating order.");
    }
  };

  const saveWithdrawnAmount = async () => {
    try {
      const newTotal = withdrawn + newWithdrawn;

      const res = await axios.put(`${API_URL}/update-withdrawn-amount`, {
        amount: newTotal,
      });

      if (res.data.success) {
        setWithdrawn(newTotal);
        setNewWithdrawn(0);
        alert("Withdrawn amount updated successfully!");
      } else {
        alert("Failed to update withdrawn amount.");
      }
    } catch (err) {
      alert("Error updating withdrawn amount.");
    }
  };

  const totalProjects = orders.length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const inProgress = orders.filter((o) => o.status === "In Progress").length;
  const accepted = orders.filter((o) => o.status === "Accepted").length;
  const totalAmount = orders.reduce(
    (sum, o) => sum + o.paidAmount + o.dueAmount,
    0
  );
  const totalPaid = orders.reduce((sum, o) => sum + o.paidAmount, 0);

  return (
    <div className="admin-container">
      <div className="signout-container">
        <button
          className="signout-btn"
          onClick={handleSignOut}
          title="Sign Out"
        >
          <FiLogOut size={16} />
          <span className="signout-text">Sign Out</span>
        </button>
      </div>

      <h2 className="admin-heading">Submitted Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>University ID</th>
            <th>Contact</th>
            <th>Type</th>
            <th>Project Info</th>
            <th>Message</th>
            <th>Status</th>
            <th>Paid (Rs)</th>
            <th>Due (Rs)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={o._id}>
              <td>{o.name}</td>
              <td>{o.universityId}</td>
              <td>{o.contact}</td>
              <td>{o.type}</td>
              <td>{o.type === "Default" ? o.projectName : o.projectDetails}</td>
              <td>{o.message}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(idx, e.target.value)}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={o.paidAmount}
                  onChange={(e) =>
                    handleAmountChange(idx, "paidAmount", e.target.value)
                  }
                  className="amount-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={o.dueAmount}
                  onChange={(e) =>
                    handleAmountChange(idx, "dueAmount", e.target.value)
                  }
                  className="amount-input"
                />
              </td>
              <td>
                <button onClick={() => saveOrder(o)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="analytics">
        <h3>Analytics Summary</h3>
        <p>Total Projects: {totalProjects}</p>
        <p>Completed Projects: {completed}</p>
        <p>In Progress Projects: {inProgress}</p>
        <p>Accepted Projects: {accepted}</p>
        <p>Total Amount (Paid + Due): Rs {totalAmount}</p>
        <p>Total Paid Amount: Rs {totalPaid}</p>
        <p>Total Withdrawn for Equipment: Rs {withdrawn}</p>
        <div className="AddAmount">
          <label>
            <br /> Add Withdrawn Amount (Rs):
            <input
              type="number"
              value={newWithdrawn}
              onChange={(e) => setNewWithdrawn(Number(e.target.value))}
              className="withdrawn-input"
            />
          </label>
          <br />
          <button onClick={saveWithdrawnAmount}>Save Withdrawn Amount</button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Admin;
