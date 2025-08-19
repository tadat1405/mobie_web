import { Spin } from 'antd'
import React from 'react'

const Loading = ({children, isPending, delay = 200,styleLoading}) => {
  return (
    <Spin style={styleLoading} spinning={isPending} delay={delay}>
      {children}
    </Spin>
  )
}

export default Loading