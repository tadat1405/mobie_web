import { Input } from 'antd';

const InputForm = (props) => {
    const {placeholder='Nhập',type, ...rest} = props;
    const handleOnchangeInput = (e)=>{
      if(props.handleOnChange){
        props.handleOnChange(e.target.value);
      }
    }
  return (
      <>
        <Input 
        onChange={handleOnchangeInput}
        placeholder = {placeholder} value={props.value} {...rest} type={type} />
      </>
  )
}

export default InputForm