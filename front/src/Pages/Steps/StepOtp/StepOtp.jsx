import React from "react";
import Card from "../../../Components/Shared/Card/Card";
import TextInput from "../../../Components/Shared/TextInput/TextInput";
import Button from "../../../Components/Shared/Button/Button";
import { useState } from "react";
import styles from "./StepOtp.module.css";
import { verifyOtp } from "../../../Http";
import { useSelector, useDispatch } from "react-redux"; //to get states from state
import { setAuth } from "../../../store/authSlice";

const StepOtp = () => {
  const [otp, setotp] = useState();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  async function handleOtp() {
    if (!otp || !phone || !hash) return;
    try {
      const { data } = await verifyOtp({
        otp,
        phone,
        hash,
      });

      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the OTP, we just texted you" icon="lock_emoji">
          <TextInput value={otp} onChange={(e) => setotp(e.target.value)} />
          <div className={styles.actionButtonwrap}>
            <Button onClick={handleOtp} text={"Next"} />
          </div>

          <p className={styles.bottomParagraph}>
            By entering your number, you are agreeing to terms and conditions.
            Thanks
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
