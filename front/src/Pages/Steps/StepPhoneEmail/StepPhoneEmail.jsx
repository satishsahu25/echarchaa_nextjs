import React, { useState } from "react";
import Phone from "./Phone/Phone";
import Email from "./Email/Email";
import styles from "./StepEmail.module.css";

const phoneEmailMap = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({ onNext }) => {
  const [type, settype] = useState("phone");
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className={styles.cardwrap}>
        <div>
          <div className={styles.buttonwrap}>
            <button
              className={`${styles.tabbtn} ${
                type === "phone" ? styles.active : ""
              }`}
              onClick={() => settype("phone")}
            >
              <img src="/images/phone_android.png" />
            </button>
            <button
              className={`${styles.tabbtn} ${
                type === "email" ? styles.active : ""
              }`}
              onClick={() => settype("email")}
            >
              <img src="/images/email.png" />
            </button>
          </div>
          <Component onNext={onNext} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneEmail;
