import { useState } from 'react';
import Image from 'next/image';
import Layout from '../../app/components/Layout2';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

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
  const handleCheckout = (e) => {
    e.preventDefault();
    // Add your checkout logic here, e.g., API call to create an order
    console.log('Checkout data:', formData);
    alert('Checkout process initiated!');
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty. Add items to your cart before checking out.</p>
        ) : (
          <div className='w-full flex'>
            <div className='flex-1 m-2'>
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
                    <td className="border px-4 py-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Price Display */}
              <div className="text-lg text-right font-bold mb-4">
                Total Price: ${totalPrice}
              </div>
            </div>
          <div className='flex-1 m-2'>
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
                  placeholder='Full Name'
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
                  placeholder='Email'
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
                  placeholder='Shipping Address'
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Complete Checkout
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
