import React from "react";
import styles from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../Components/Shared/Card/Card";
import Button from "../../Components/Shared/Button/Button";

const Home = () => {
  const signinlink = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "20px",
  };

  const history = useNavigate();

  const startRegister = () => {
    history("/authenticate");
  };

  return (
    <div className={styles.cardwrapper}>
      <Card title="Welcome to ViChat" icon="Emoji">
        <div className={styles.card}>
          <div className={styles.headingWrapper}>
            <img src="/images/Emoji.png" alt="logo" />
            <h1 className={styles.heading}>Welcome to ViChat</h1>
          </div>
          <p className={styles.text}>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit
          </p>
          <div>
            <Button onClick={startRegister} text={"Let's go"} />
          </div>
          <div className={styles.signinwrapper}>
            <span className={styles.hasinvite}>Have an invite text?</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
