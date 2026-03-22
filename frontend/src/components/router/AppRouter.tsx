import React, {JSX} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import Main from "../pages/main/Main";
import MenuPage from "../pages/admin/menuPage/MenuPage";
import Profile from "../pages/profile/Profile";
import CheckoutPage from "../pages/checkoutPage/CheckoutPage";
import GiftCardPage from "../pages/giftCardPage/GiftCardPage";
import OrderTrackingPage from "../pages/orderTrackingPage/OrderTrackingPage";
import BookingPage from "../pages/bookingPage/BookingPage";
import AdminBookingPage from "../pages/admin/bookingPage/AdminBookingPage";
import AdminHomePage from "../pages/admin/homePage/AdminHomePage";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import ResetPassword from "../pages/resetPassword/ResetPassword";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

interface AdminRouteProps {
    children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};


const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Main/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/checkout"
                element={
                    <PrivateRoute>
                        <CheckoutPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/gift"
                element={
                    <PrivateRoute>
                        <GiftCardPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <PrivateRoute>
                        <OrderTrackingPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/booking"
                element={
                    <PrivateRoute>
                        <BookingPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminHomePage/>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/menu"
                element={
                    <AdminRoute>
                        <MenuPage/>
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/booking"
                element={
                    <AdminRoute>
                        <AdminBookingPage/>
                    </AdminRoute>
                }
            />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="*" element={<Navigate to={"/login"}/>}/>
        </Routes>
    );
};

export default AppRouter;
