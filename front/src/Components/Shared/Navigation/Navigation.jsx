import React from "react";
import styles from "./naviagtion.module.css";
//dont not refresh the page
import { Link } from "react-router-dom";
import { logout } from "../../../Http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice.js";

const Navigation = () => {
  const { isAuth, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  //Inline styles-----------
  const brandstyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };
  const logotext = {
    marginLeft: "10px",
  };

  async function logoutUser() {
    try {
      const { data } = await logout();

      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={`${styles.navbar} container `}>
      <Link to="/" style={brandstyle}>
        <img src="/images/Emoji.png" />
        <span style={logotext}>ViChat</span>
      </Link>
    {isAuth&&(<div className={styles.navRight}>
        <h3>{user?.name}</h3>
       {user.avatar&& (<Link to="/">
        <img 
        className={styles.avatar}
        src={user.avatar?user.avatar:"/images/people.png"}  />
        </Link>)}
        {isAuth && <button className={styles.logoutbtn} onClick={logoutUser}>
        <img src={"/images/logout.png"} alt="logout"/>
        </button>}
      </div>)}
    </nav>
  );
};

export default Navigation;
