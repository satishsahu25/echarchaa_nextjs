import React, { useState } from "react";
import Card from "../../../../Components/Shared/Card/Card";
import Button from "../../../../Components/Shared/Button/Button";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import { useDispatch } from "react-redux";
import styles from "../StepEmail.module.css";
import { sendOtp } from "../../../../Http/index.js";
import { setOtp } from "../../../../store/authSlice.js";

const Phone = ({ onNext }) => {
  const [phoneNumber, setphoneNumber] = useState("");
  const dispatch = useDispatch();

  async function submitPhone() {
    if (!phoneNumber) return;

    const { data } = await sendOtp({ phone: phoneNumber });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  }

  return (
    <Card title="Enter your phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => {
          setphoneNumber(e.target.value);
        }}
      />
      <div>
        <div className={styles.actionbtnwrap}>
          <Button text="Next" onClick={submitPhone} />
        </div>
        <p className={styles.bottomParagraph}>
          mg elements must have an alt prop, either with meaningful text
        </p>
      </div>
    </Card>
  );
};

export default Phone;
