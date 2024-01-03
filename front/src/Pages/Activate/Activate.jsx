import React, { useState } from 'react'
import StepProfile from '../Steps/StepProfile/StepProfile'
import styles from './activate.module.css'
import StepName from '../Steps/StepName/StepName';

const steps = {
  1:StepName,
  2:StepProfile,
};

const Activate = () => {

  const [step, setstep] = useState(1);
  const Component = steps[step];


  function onNext(){
    setstep(step+1);
  }


  return (
    <>
      <div className='cardWrapper'>
      <Component onNext={onNext}></Component>
      </div>
    </>
  )
}

export default Activate