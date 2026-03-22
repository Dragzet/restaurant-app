import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/router/AppRouter";
import Header from "./components/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "./store/store"; // путь к store

function App() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <BrowserRouter>
            {isAuthenticated && <Header />}
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;