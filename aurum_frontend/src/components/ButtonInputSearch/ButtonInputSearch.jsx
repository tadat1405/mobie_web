import { SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'

const ButtonInputSearch = (props) => {
    const {size, placeholder, textButton, bordered,
         backgroundColor = '#fff'
     } = props
  return (
    <div style={{
        display: 'flex',
        gap: '5px',
    }}>
        <InputComponent {...props} size={size} placeholder={placeholder} bordered={bordered} style={{
            backgroundColor: backgroundColor
        }}/>
        <Button size={size} icon={<SearchOutlined />}>{textButton}</Button>
    </div>
  )
}

export default ButtonInputSearch