import React from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg ">
        <div className="container">
          <div className="navbar--container">
            <Link className="btn btn-dark text-bg-dark fs-1" to="/">
              <h1 className="name text-white">Shielded Secrets</h1>
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse " id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2 p-2">
                <NavLink
                  className="nav-link "
                  activeClassName="active"
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item mx-2 p-2 ">
                <NavLink
                  className="nav-link "
                  activeClassName="active"
                  aria-current="page"
                  to="/encoder"
                >
                  Encoder
                </NavLink>
              </li>
              <li className="nav-item mx-2 p-2">
                <NavLink
                  className="nav-link "
                  activeClassName="active"
                  aria-current="page"
                  to="/decoder"
                >
                  Decoder
                </NavLink>
              </li>
              <li className="nav-item mx-2 p-2">
                <NavLink
                  className="nav-link "
                  activeClassName="active"
                  aria-current="page"
                  to="/about"
                >
                  About
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
