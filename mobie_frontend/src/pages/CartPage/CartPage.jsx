import React, { useState } from 'react';
import { Checkbox, Col, Row, Button, InputNumber, Divider } from 'antd';
import './CartPage.scss';
import { DeleteOutlined } from '@ant-design/icons';





  // THẰNG NÀY KHÔNG DÙNG TỚI -----------------------






const CartPage = () => {
  const [quantity, setQuantity] = useState(10);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false]); // mỗi sản phẩm 1 checkbox

  const unitPrice = 211;
  const originalPrice = 230;
  const totalPrice = quantity * unitPrice;

  // Handle chọn tất cả
  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setCheckedAll(checked);
    setCheckedItems(checkedItems.map(() => checked)); // tất cả true/false
  };

  // Handle chọn từng sản phẩm
  const handleCheckItem = (index, e) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = e.target.checked;
    setCheckedItems(newCheckedItems);

    // nếu tất cả đều là true -> checkAll = true
    setCheckedAll(newCheckedItems.every(Boolean));
  };

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      <Row className="cart-header">
        <Col span={10}>
          <Checkbox checked={checkedAll} onChange={handleCheckAll}>
            Tất cả (1 sản phẩm)
          </Checkbox>
        </Col>
        <Col span={4}>Đơn giá</Col>
        <Col span={4}>Số lượng</Col>
        <Col span={4}>Thành tiền</Col>
      </Row>
      <Divider />

      <Row className="cart-item" align="middle">
        <Col span={10} className="cart-product">
          <Checkbox
            checked={checkedItems[0]}
            onChange={(e) => handleCheckItem(0, e)}
          />
          <img
            src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls8ktsq2wdy69e"
            alt="product"
            className="product-image"
          />
          <span>name sản ooamr</span>
        </Col>
        <Col span={4}>
          <span className="price-discounted">{unitPrice}</span>
          <span className="price-original">{originalPrice}</span>
        </Col>
        <Col span={4}>
          <div className="quantity-controls">
            <Button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</Button>
            <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
            <Button onClick={() => setQuantity((prev) => prev + 1)}>+</Button>
          </div>
        </Col>
        <Col span={4}>
          <span className="total-price">{totalPrice}</span>
        </Col>
        <Col span={2}>
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
        </Col>
      </Row>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Tạm tính</span>
          <span>0</span>
        </div>
        <div className="summary-row">
          <span>Giảm giá</span>
          <span>0</span>
        </div>
        <div className="summary-row">
          <span>Thuế</span>
          <span>0</span>
        </div>
        <div className="summary-row">
          <span>Phí giao hàng</span>
          <span>0</span>
        </div>
        <Divider />
        <div className="summary-row total">
          <span>Tổng tiền</span>
          <span className="summary-total">0213</span>
        </div>
        <p className="vat-text">(Đã bao gồm VAT nếu có)</p>
        <Button type="primary" danger block size="large">
          Mua hàng
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
