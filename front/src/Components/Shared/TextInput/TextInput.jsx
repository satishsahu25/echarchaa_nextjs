import React from 'react'
import styles from './Textinput.module.css'

const TextInput = (props) => {
  return (
    <>
        <input style={{width:props.fullWidth==="true"?"100%":'inherit'}} 
        className={styles.input} type="text" {...props}/>
    </>
  )
}

export default TextInput