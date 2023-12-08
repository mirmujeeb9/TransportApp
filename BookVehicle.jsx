import React, { useState, useEffect,useContext } from "react";
// The rest of your imports remain the same

//import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs
import img from "./rentalpage.jpg";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";
const BookVehicle = () => {

  const [isCustomRoute, setIsCustomRoute] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [predefinedRoutes, setPredefinedRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDateTime, setPickupDateTime] = useState("");
  const { _id } = useContext(AuthContext);
  


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Replace 'http://localhost:5000' with the actual base URL of your server
        const response = await axios.get('http://localhost:3000/users/all_routes');
        setPredefinedRoutes(response.data);
      } catch (error) {
        console.error("Error fetching predefined routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const handlePredefinedRouteChange = (event) => {
    setSelectedRouteId(event.target.value);
  };
  
  const handleRouteSelection = (event) => {
    const routeType = event.target.value;
    setIsCustomRoute(routeType === "custom");
    if (routeType !== "custom") {
      setSelectedRouteId(event.target.value);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();


    if (isCustomRoute) {
      // Custom route: Create the route first, then create the booking
      try {
        
        const routeResponse = await axios.post('http://localhost:3000/users/add_route', {
          from: pickupLocation,
          to: destination,
          drivername: '-',
          fare: '0',
          
        });
        if (routeResponse.data && routeResponse.data._id) {
        // Use the new route ID to create a booking
        const bookingResponse = await axios.post('http://localhost:3000/users/add_booking', {
          route_id: routeResponse.data._id,
          date: pickupDateTime,
          customer_id: _id,
        },{
          withCredentials: true
        });

        setBookingConfirmation(`Your custom route booking is confirmed. Booking ID: ${bookingResponse.data._id}`);
       
        }
      } catch (error) {
        console.error("Error in custom route booking:", error);
        // Handle error by setting state or alerting the user
      }
    } else {
      // Predefined route: Directly create the booking
      try {
        const bookingResponse = await axios.post('http://localhost:3000/users/add_booking', {
          route_id: selectedRouteId,
          date: pickupDateTime,
          customer_id: _id,
        },{
          withCredentials: true
        });

        setBookingConfirmation(`Your predefined route booking is confirmed. Booking ID: ${bookingResponse.data._id}`);
      } catch (error) {
        console.error("Error in predefined route booking:", error.response || error);
        // Handle error by setting state or alerting the user
      }
    }
  };

  // Updated Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 50px",
    },
    imageSection: {
      background: `url('/rentalpage.jpg') no-repeat center center`,
      backgroundSize: "fit",
      height: "450px",
    },
    formContainer: {
      backgroundColor: "#fff",
      padding: "20px 50px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginTop: "-100px",
      textAlign: "left",
    },
    heading: {
      fontSize: "2.5rem",
      color: "#333",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      margin: "0 10px",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      marginBottom: "10px",
    },
    select: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      cursor: "pointer",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#555",
    },
    confirmation: {
      backgroundColor: "#f0f0f0",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginTop: "20px",
      textAlign: "center",
      fontSize: "1.2rem",
    },
  };

  return (
    <div style={styles.container}>
      <img style={styles.imageSection} src={img} />
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Book your Car through your app!</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Pick-up Date/Time</label>
            <input type="datetime-local" style={styles.input} onChange={e => setPickupDateTime(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Route Selection</label>
            <select onChange={handleRouteSelection} style={styles.select}>
              <option value="predefined">Predefined Routes</option>
              <option value="custom">Custom Route</option>
            </select>
          </div>
          {isCustomRoute ? (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pickup Location</label>
                <input type="text" placeholder="Pickup Location" style={styles.input} onChange={e => setPickupLocation(e.target.value)} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Destination</label>
                <input type="text" placeholder="Destination" style={styles.input} onChange={e => setDestination(e.target.value)} />
              </div>
            </>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Route</label>
              <select onChange={handlePredefinedRouteChange} style={styles.select}>
              <option value="">Select a Route</option>
                {predefinedRoutes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.from} to {route.to}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={styles.inputGroup}>
            <button type="submit" style={styles.button}>
              BOOK NOW
            </button>
          </div>
        </form>
        {bookingConfirmation && (
          <div style={styles.confirmation}>{bookingConfirmation}</div>
        )}
      </div>
    </div>
   
  );
};

export default BookVehicle;
