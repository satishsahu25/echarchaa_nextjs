import React, { useEffect, useState } from "react";
import Card from "../../../Components/Shared/Card/Card";
import Button from "../../../Components/Shared/Button/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styles from "./StepProfile.module.css";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../Http/index.js";
import { setAuth } from "../../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/Shared/Loader/Loader.jsx";

const StepProfile = ({ onNext }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setimage] = useState("/images/man_image.png");
  const [loading, setloading] = useState(false);
  // const [unmount,setunmount] = useState(false);


  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setimage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function imageSubmit() {
    if (!name || !avatar) return;

    setloading(true);

    try {
      const { data } = await activate({ name, avatar });

      if (data.auth) {
      
          dispatch(setAuth(data));
        
        
      }
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  }

/////////CLEAN UP FUNCTIONS////////






  if (loading) return <Loader message="Activation in progress..." />;

  return (
    <>
      <Card title={`Okay ${name}`} icon="face_emoji">
        <p className={styles.subheading}>How is this photo</p>

        <div className={styles.imageWrap}>
          <img className={styles.imageAvatar} src={image} />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different image
          </label>
        </div>

        <div>
          <Button onClick={imageSubmit} text={"Next"} />
        </div>
      </Card>
    </>
  );
};

export default StepProfile;
