import React from 'react'
import './NavbarComponent.scss'
import { Checkbox, Rate, Row } from 'antd'

const NavbarComponent = () => {
    const onChange =()=>{}
    const renderContent = (type, options)=>{
        switch(type){
            case 'text':
                return (
                    <div className='wraper_text_value'>
                        {
                        options.map((option)=>{
                            return (
                                <div>
                                    {option}
                                </div>                                                                
                                    )
                             })
                        }
                    </div>
                )
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%'}} onChange={onChange}>
                        <Row style={{ display: 'flex', flexDirection: 'column', gap: '10px'}} >
                            {
                                options.map((option)=>{
                                    return (
                                        <div>
                                            <Checkbox value={option.value}>{option.lable}</Checkbox>
                                        </div>
                                    )
                                })
                            }
                        </Row>
                    </Checkbox.Group>
                )
            case 'start':
                return (
                    <div>
                        {
                        options.map((option)=>{
                        return (
                            <div>
                                    <Rate style={{
                                        fontSize: '16px',
                                        marginRight: '10px'
                                    }} disabled defaultValue={option} />
                                    <span style={{ fontSize: '14px'}}>{`từ ${option} sao`}</span>

                            </div> 
                        )
                    })
                }
                    </div>
                )
            case 'price':
                return (
                <div>
                    {options.map((option)=>{
                        return (
                            <div className='text-price'>
                                {option}
                            </div>
                        )
                    })}
                </div>
            )
            default:
                return {}
        }
    }
  return (
    <div>
        <div className='wraper_lable_text'>Lable</div>
        <div>
            <div>
            {renderContent('text', ['Tu lanh', 'Tivi', 'May giat'])}
            </div>
            <div>
                {renderContent('checkbox', [
                {value: 'a', lable: 'A'},
               {value: 'b', lable: 'B'}
            ])} 
            </div>
            <div>
                 {renderContent('start', [3,4,5])} 
            </div>
            <div>
                 {renderContent('price', ['Dưới 40','Trên 50'])} 
            </div>
        </div>
       
    </div>
  )
}

export default NavbarComponent