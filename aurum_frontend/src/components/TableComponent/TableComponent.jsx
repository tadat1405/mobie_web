import React, { useState } from 'react'
import { Divider, Dropdown, Radio, Space, Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { DownOutlined } from '@ant-design/icons';
import './TableComponent.scss'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useMemo } from 'react';
import { Excel } from 'antd-table-saveas-excel';
const TableComponent = (props) => {
    const {selectionType = 'checkbox',  columns=[],data: dataSource=[], isPending = false, handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

    const newColumnExport = useMemo(()=>{
      const arr = columns?.filter((col)=> col.key !== 'action')
      return arr;
    },[columns]);


     const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setRowSelectedKeys(selectedRowKeys)
  },
  // getCheckboxProps: record => ({
  //   disabled: record.name === 'Disabled User',
  //   name: record.name,
  // }),
};
const handleDeleteAll = ()=>{
  handleDeleteMany(rowSelectedKeys)
}
const exportExcel = ()=>{
  const excel = new Excel();
  excel
    .addSheet('table')
    .addColumns(newColumnExport)
    .addDataSource(dataSource,{
      str2Percent: true
    })
    .saveAs('Excel.xlsx')
}
  return (
    <div>
      <Loading isPending={isPending}>
        {rowSelectedKeys?.length >0 && 
         <div className="delete-all-button" onClick={handleDeleteAll}>
           Xóa tất cả
        </div>}
        <button className='download-table-xls-button' onClick={exportExcel}>
          Xuất excel
        </button>
        <Table
        id='table-xls'
        rowSelection={Object.assign({ type: selectionType }, rowSelection)}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
      </Loading>
    </div>
  )
}

export default TableComponent