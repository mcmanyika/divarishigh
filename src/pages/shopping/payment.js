'use client';
import CheckoutPage from "../../app/components/CheckoutPage";
import convertToSubcurrency from "../../app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SmartBlankLayout from "../../app/components/SmartBlankLayout";
import { useCart } from '../../context/CartContext';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const { cart } = useCart();

  // Ensure cart is defined and not empty
  if (!cart || cart.length === 0) {
    return <p>Your cart is empty. Please add items to proceed with the payment.</p>;
  }

  // Calculate total price and convert it to a number for Stripe
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const amount = parseFloat(totalPrice.toFixed(2));  // Ensure amount is a float

  return (
    <SmartBlankLayout>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),  // Convert amount to subunit (e.g., cents)
          currency: "usd",  // Ensure this is the correct currency code
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </SmartBlankLayout>
  );
}
