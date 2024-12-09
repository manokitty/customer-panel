import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NavigationBar from "./components/NavigationBar/NavigatationBar";
import MenuManagement from "./components/MenuManagement/MenuManagement";
import OrderQueue from "./components/OrderQueue/OrderQueue";
import ReservationPage from "./components/Reservations/ReservationsPage";
import ViewReservations from "./components/Reservations/ViewReservations";
import ReserveTable from "./components/Reservations/ReserveTable";
import ReviewPage from "./components/Review/ReviewPage"; 
const App = () => {
  return (
    <Router>
      <NavigationBar />
      <div className="main-content">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Menu Management */}
          <Route path="/menu-management" element={<MenuManagement />} />
         
          {/* Order Queue */}
          <Route path="/order-queue" element={<OrderQueue />} />

          {/* Reservations */}
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/reserve-table" element={<ReserveTable />} />
          <Route path="/view-reservations" element={<ViewReservations />} />
          {/* Review */}
          <Route path="/review" element={<ReviewPage />} /> 

          {/* Fallback Route (Optional) */}
          <Route
            path="*"
            element={<h2 style={{ textAlign: "center" }}>404: Page Not Found</h2>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
