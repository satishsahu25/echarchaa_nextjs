import React from 'react'
import styles from './btn.module.css'

const Button = ({text,onClick}) => {
  return (
    <button onClick={onClick} className={styles.button}>
     <span>{text}</span>
              <img className={styles.arrow} src="/images/arrow_forward.png" />
    </button>
  )
}

export default Button