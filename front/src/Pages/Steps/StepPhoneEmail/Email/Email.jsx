import React, { useState } from 'react'
import Card from '../../../../Components/Shared/Card/Card'
import Button from '../../../../Components/Shared/Button/Button'
import TextInput from '../../../../Components/Shared/TextInput/TextInput'
import styles from '../StepEmail.module.css'

const Email = ({onNext}) => {
  const [email, setemail] = useState("");

  return (
    <Card title="Enter your email address" icon="emailemoji">
     <TextInput
        value={email}
        onChange={(e) => {
          setemail(e.target.value);
        }}
      />
   <div>
        <div className={styles.actionbtnwrap}>
          <Button text="Next" onClick={onNext}/>
        </div>
        <p className={styles.bottomParagraph}>
        mg elements must have an alt prop, either with meaningful text
        </p>
      </div>
  </Card>
  )
}

export default Email