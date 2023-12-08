import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'; 
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe("pk_test_51MC7IZKE7yyXcUzGxI8mDV3TGw4z78JT4dUnCX6K8YMYWh0ndge0CH7j0LrWoqzpOEn7KvtzP67UMegjF9DwXKp300o7SXJz8o");

const CheckoutForm = () => {
  const navigate=useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 1000 }) // amount in cents
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Customer Name',
                },
            },
        });

        if (result.error) {
            setPaymentStatus(`Payment failed: ${result.error.message}`);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                setPaymentStatus('Payment sent successfully!');
            }
        }
    };

    // Inline styles
    const styles = {
        paymentForm: {
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px',
            backgroundColor: '#f4f7f6',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        cardElement: {
            padding: '10px 14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '20px',
        },
        payButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
        },
        disabledButton: {
            backgroundColor: '#ccc',
        },
        paymentStatus: {
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '16px',
        }
    };

    return (
        <div style={styles.paymentForm}>
            <form onSubmit={handleSubmit}>
                <CardElement style={styles.cardElement} />
                <button
                    type="submit"
                    style={stripe ? styles.payButton : { ...styles.payButton, ...styles.disabledButton }}
                    disabled={!stripe}
                >
                    Pay
                </button>
            </form>
            {paymentStatus && <div style={styles.paymentStatus}>{paymentStatus}</div>}
        </div>
    );
};

const StripePayment = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default StripePayment;
