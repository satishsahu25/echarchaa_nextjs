import React, { useState } from "react";
import Card from "../../../Components/Shared/Card/Card";
import TextInput from "../../../Components/Shared/TextInput/TextInput";
import Button from "../../../Components/Shared/Button/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";
import styles from "./StepName.module.css";

const StepName = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.activate);
  
  const [fullname, setfullname] = useState(name);

  function onNextStep() {
    if (!fullname) {
      return;
    }

    dispatch(setName(fullname));
    onNext();
  }

  return (
    <>
      <Card title="What is your fullname" icon="face_emoji">
        <TextInput
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
        />
        <p className={styles.bottomParagraph}>Hey Hurrah</p>
        <div>
          <Button onClick={onNextStep} text={"Next"} />
        </div>
      </Card>
    </>
  );
};

export default StepName;
