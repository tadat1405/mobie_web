import { useEffect, useState } from 'react'
import './ProfilePage.scss'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import { updateUser } from '../../redux/slice/userSlide';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../../utils';
const ProfilePage = () => {
    const user  = useSelector((state)=>state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    const dispatch = useDispatch()

    const mutation = useMutationHook(
     async (data) =>{
        const {id,access_token, ...rests} = data
       const res = await UserService.updateUser(id, rests, access_token)
       return res
      }
     )
     const {isPending,isError,isSuccess} = mutation;

    useEffect(()=>{
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    },[user]) ;

    useEffect(()=>{
        if(isSuccess){
            toast.success("Success")
            handleGetDetailsUser(user?.id, user?.access_token)
        }
        else if(isError){
            toast.error("Error")
        }
    },[isError,isSuccess])

    const handleGetDetailsUser = async (id,token)=>{
        const res = await UserService.getDetailsUser(id,token);
        dispatch(updateUser({...res?.data, access_token: token}))
      }

    const handleOnChangEmail = (e)=>{
        setEmail(e.target.value);
    }
    const handleOnChangName = (e)=>{
        setName(e.target.value)
    }
    const handleOnChangPhone = (e)=>{
        setPhone(e.target.value)
    }
    const handleOnChangAddress = (e)=>{
        setAddress(e.target.value)
    }
    const handleOnChangAvatar = async (file) => {
    const preview = await getBase64(file);
    setAvatar(preview);
    console.log(preview)
    return false;
    }
    const handleUpdate= ()=>{
        mutation.mutate({id: user?.id,  name, email, phone, address, avatar, access_token: user?.access_token});
    }
    console.log(user)
  return (
    <div className='profile-page'>
        <Loading styleLoading={{with: '100%'}} isPending={isPending}  >
                <div className='profile'>
            <h1 className='header'>Thông tin người dùng</h1>
            <div className='content-profile'>
                <div className='input email'>
                    <span>Email</span>
                    <input value={email} onChange={handleOnChangEmail}/>
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
                <div className='input name'>
                    <span>Name</span>
                    <input value={name} onChange={handleOnChangName}/>
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
                <div className='input phone'>
                    <span>Phone</span>
                    <input value={phone} onChange={handleOnChangPhone}/>
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
                <div className='input address'>
                    <span>Address</span>
                    <input value={address} onChange={handleOnChangAddress}/>
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
                <div className='input avatar'>
                    <span>Avatar</span>
                    <Upload beforeUpload={handleOnChangAvatar} showUploadList={false}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    {avatar && (<img src={avatar} style={{
                        height: '150px',
                        width: '150px',
                        borderRadius: '10px',
                        objectFit: 'cover'
                    }} alt='avatar'/>)}
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
            </div>
        </div>
        </Loading>
    </div>
  )
}

export default ProfilePage