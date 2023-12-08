import React, { useState,useContext,useEffect } from 'react';
import AuthContext from '../../Context/AuthContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Past_records = () => {
  const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState({ pending: [], approved: [] });
  const { _id: userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchBookingsAndRoutes = async () => {
      try {
        // Fetch bookings for the user
        const bookingResponse = await axios.get(`http://localhost:3000/users/userbookings/${userId}`);
        const userBookings = bookingResponse.data;

        // Fetch route details for each booking
        const routesResponse = await Promise.all(userBookings.map(booking => 
          axios.get(`http://localhost:3000/users/routesforbookings/${booking.route_id}`)
        ));
        const routeDetails = routesResponse.map(response => response.data);

        // Combine bookings with their route details
        const combinedBookings = userBookings.map((booking, index) => ({
          ...booking,
          route: routeDetails[index]
        }));

        // Separate bookings into pending and approved
        const pendingBookings = combinedBookings.filter(booking => booking.status === 'pending');
        const approvedBookings = combinedBookings.filter(booking => booking.status === 'approved');
        setBookings({ pending: pendingBookings, approved: approvedBookings });
      } catch (error) {
        console.error("Error fetching bookings and routes:", error);
      }
    };

    if (userId) {
      fetchBookingsAndRoutes();
    }
  }, [userId]);

  // Styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    tabSelector: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    tabButton: {
      padding: '10px 20px',
      margin: '0 10px',
      border: 'none',
      borderRadius: '20px',
      background: '#ddd',
      color: '#333',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    activeTabButton: {
      background: '#007bff',
      color: '#fff',
    },
    table: {
      width: '100%',
      marginTop: '20px',
      borderCollapse: 'collapse',
    },
    th: {
      background: '#007bff',
      color: '#fff',
      padding: '10px',
      border: '1px solid #ddd',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'center',
    },
    statusPending: {
      color: '#e67e22',
      fontWeight: 'bold',
    },
    statusApproved: {
      color: '#27ae60',
      fontWeight: 'bold',
    },
  };
  const handlepaymentClick = () => {
    // Your onClick logic here
    navigate('/payment');
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabSelector}>
        <button
          style={activeTab === 'pending' ? { ...styles.tabButton, ...styles.activeTabButton } : styles.tabButton}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          style={activeTab === 'approved' ? { ...styles.tabButton, ...styles.activeTabButton } : styles.tabButton}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Booking ID</th>
            <th style={styles.th}>Pickup Location</th>
            <th style={styles.th}>Destination</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Time</th>
            {activeTab === 'approved' && <th style={styles.th}>Fare</th>}
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings[activeTab].map((booking, index) => (
            <tr key={index}>
              <td style={styles.td}>{booking._id}</td>
              <td style={styles.td}>{booking.route.from}</td>
              <td style={styles.td}>{booking.route.to}</td>
              <td style={styles.td}>{new Date(booking.date).toLocaleDateString()}</td>
              <td style={styles.td}>{new Date(booking.date).toLocaleTimeString()}</td>
              {activeTab === 'approved' && <td style={styles.td}>${booking.route.fare}</td>}
              <td style={styles.td}>
                <span style={booking.status === 'pending' ? styles.statusPending : styles.statusApproved}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <button
    onClick={handlepaymentClick}
    style={{ cursor: 'pointer', border: 'none', background: 'none' }}
  >
    {activeTab === 'approved' && (
      <td style={styles.td}>pay for driver </td>
    )}
  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
          };
  

export default Past_records;