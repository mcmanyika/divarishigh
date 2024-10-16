import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../../app/components/Layout2';
import { useCart } from '../../context/CartContext';
import axios from 'axios';

// Initialize Stripe
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { cart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle checkout submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stripe = await stripePromise;

    // Prepare items for Stripe Checkout
    const items = cart.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Prepare customer information
    const customerInfo = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
    };

    try {
      // Create a checkout session
      const { data } = await axios.post('/api/checkout_session', { items, customerInfo });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty. Add items to your cart before checking out.</p>
        ) : (
          <div className="w-full flex">
            <div className="flex-1 m-2">
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2"></th>
                    <th className="border px-4 py-2">Product</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <Image src={item.product.imageUrl} width={60} height={30} alt={item.product.name} />
                      </td>
                      <td className="border px-4 py-2">{item.product.name}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Price Display */}
              <div className="text-lg text-right font-bold mb-4">
                Total Price: ${totalPrice}
              </div>
            </div>
            <div className="flex-1 m-2">
              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                    rows="4"
                    placeholder="Shipping Address"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'} text-white py-2 rounded`}
                >
                  {loading ? 'Processing...' : 'Complete Checkout'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
