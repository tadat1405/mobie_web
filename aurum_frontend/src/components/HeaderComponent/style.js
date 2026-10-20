import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
 padding: 10px 120px;
 background-color: rgba(255, 247, 26, 0.85);
 align-items: center;
 gap: 16px;
 flex-wrap: nowrap;
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: left;
`
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 12px;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #333;
    white-space: nowrap;
    cursor: pointer;
`
