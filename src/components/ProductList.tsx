import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { read } from '../firebase/database'

import {
  Button,
  Table
} from 'antd'

const { Column } = Table

// const initSource = [
//   {
//     id: '0001',
//     userName: 'Honye Morake',
//     description: '注文内容がここに入ります',
//     productStatus: '作成中',
//     depositStatus: '入金済み',
//     depositMail: 'YYYY/MM/DD',
//     shipmentStatus: 'YYYY/MM/DD',
//     shipmentMail: 'YYYY/MM/DD',
//     key: '0'
//   }
// ]
// read('products/').then((v: any) => {
//   const db = v.val()
  
//   Object.keys(db).forEach((key) => {
//     dataSource.push(db[key])
//   })
// })


class ProductList extends React.Component <any> {
  constructor(props: any) {
    super(props)
    this.state = { dataSource: [
      {
        id: '0001',
        userName: 'Honye Morake',
        description: '注文内容がここに入ります',
        productStatus: '作成中',
        depositStatus: '入金済み',
        depositMail: 'YYYY/MM/DD',
        shipmentStatus: 'YYYY/MM/DD',
        shipmentMail: 'YYYY/MM/DD',
        key: '0'
      }   
    ]}
    let dataSource: any = []
    read('products/').then((v: any) => {
      const db = v.val()
      
      Object.keys(db).forEach((key) => {
        dataSource.push(db[key])
      })
      console.log(dataSource)
      this.setState({dataSource})
      
    })
  }

  render () {
    const { history } = this.props
    const { dataSource }: any = this.state
    return (
      <Table
        dataSource={dataSource}
        bordered
      >
        <Column
          title='注文ID'
          dataIndex='id'
          key='id'
        />
        <Column
          title='購入者名'
          dataIndex='userName'
          key='userName'
        />
        <Column
          title='商品内容'
          dataIndex='description'
          key='description'
        />
        <Column
          title='商品状態'
          dataIndex='productStatus'
          key='productStatus'
        />
        <Column
          title='入金'
          dataIndex='depositStatus'
          key='depositStatus'
        />
        <Column
          title='入金確認メール'
          dataIndex='depositMail'
          key='mailStatus'
        />
        <Column
          title='発送'
          dataIndex='shipmentStatus'
          key='shipmentStatus'
        />
        <Column
          title='発送メール'
          dataIndex='shipmentMail'
          key='shipmentMail'
        />
        <Column
          title=''
          key='edit'
          render={({ id }: { id: string }) => (
            <Button
              onClick={() => {
                history.push(`product/edit/${id}`)
              }}
            >
              編集
            </Button>
          )}
        />
      </Table>
    )
  }
}

export default withRouter(ProductList)
