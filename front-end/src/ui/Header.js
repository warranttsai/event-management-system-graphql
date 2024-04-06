import React from "react";
import "../style/Header.css";

export default function Header() {
  return (
    <div class="top-bar global-bg-black global-text-color-white pl-3">
      <div class="top-bar-left">Event Management System</div>
      <ul className="menu align-right global-bg-black">
        <li className="global-bg-black">
          <a className=" global-text-color-white  text-hover" href="/auth">
            Authenticate
          </a>
        </li>
        <li className="global-bg-black">
          <a className=" global-text-color-white  text-hover" href="/events">
            Events
          </a>
        </li>
        <li className="global-bg-black">
          <a className=" global-text-color-white  text-hover" href="/bookings">
            bookings
          </a>
        </li>
      </ul>
    </div>
  );
}
