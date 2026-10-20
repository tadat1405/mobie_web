import { Button } from 'antd/es/radio'
import React from 'react'

const ButtonComponent = ({size, styleButton, styleTextButton, textButton, ...rest}) => {
  return (
    <Button 
    size = {size}
    style={styleButton}
    >
        <span style={styleTextButton}>{textButton}</span>

    </Button>
  )
}

export default ButtonComponent