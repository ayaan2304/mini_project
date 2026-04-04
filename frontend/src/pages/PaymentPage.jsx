import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const [message, setMessage] = useState("");

  const pay = async () => {
    const amount = days === 30 ? 999 : 1699;
    await apiRequest("/payment/checkout", {
      method: "POST",
      token,
      body: { courseId, amount, planDurationDays: days },
    });
    setMessage("Payment successful. Full access unlocked.");
    setTimeout(() => navigate(`/courses/${courseId}`), 1000);
  };

  return (
    <section>
      <h2>Choose a Plan</h2>
      <div className="grid">
        <article className={`card hover ${days === 30 ? "active" : ""}`}>
          <h3>1 Month</h3>
          <p className="price">Rs. 999</p>
          <button className="btn" onClick={() => setDays(30)}>Select</button>
        </article>
        <article className={`card hover ${days === 60 ? "active" : ""}`}>
          <h3>2 Months</h3>
          <p className="price">Rs. 1699</p>
          <button className="btn" onClick={() => setDays(60)}>Select</button>
        </article>
      </div>
      <button className="btn secondary" onClick={pay}>Pay Now (Mock Checkout)</button>
      {message && <p className="success">{message}</p>}
    </section>
  );
};

export default PaymentPage;
