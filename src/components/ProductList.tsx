import * as React from 'react'
import {
  Button,
  Popconfirm,
  Table,
  Tag
} from 'antd'

const { Column } = Table

import { State, StateUpdates } from '../containers/ProductList'

type ViewProps = State & StateUpdates

type ActionProps = {
  pushToEditPage: (id: string) => void
  pushToPrintPage: () => void
}

type Props = ViewProps & ActionProps

const ProductList: React.SFC <Props> = ({
  pushToEditPage,
  pushToPrintPage,
  dataSource,
  selectedRowKeys,
  onChangeSelection
}) => (
  <div>
    <Button
      disabled={!selectedRowKeys.length}
      onClick={pushToPrintPage}
    >送り状印刷</Button>
    <Table
      dataSource={dataSource}
      bordered
      rowSelection={{
        selectedRowKeys,
        onChange: onChangeSelection
      }}
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
        key='products'
        render={({ products }: any ): any => {
          if (products) {
            return Object.keys(products).map((key: string, i: number): any => {
              const regKey = key.toLowerCase()
              if (regKey.match(/tomix/)) {
                return (
                  <div key={i}>
                    <Tag color='#108ee9'>{key}</Tag>: {products[key]}
                  </div>
                )
              } else if (regKey.match(/kato/)) {
                return (
                  <div key={i}>
                    <Tag color='#003300'>{key}</Tag>: {products[key]}
                  </div>
                )
              } else if (regKey.match(/micro/)) {
                return (
                  <div key={i}>
                    <Tag color='#F40301'>{key}</Tag>: {products[key]}
                  </div>
                )
              } else {
                return (
                  <div key={i}>
                    <Tag>{key}</Tag>: {products[key]}
                  </div>
                )
              }
            })
          }
        }}
      />
      <Column
        title='商品状態'
        key='productStatus'
        render={({ productStatus }: any): any => {
          switch (productStatus) {
            case '0':
              return '手配中'
            case '1':
              return '入荷中'
            case '2':
              return '入荷済'
          }
        }}
      />
      <Column
        title='入金'
        key='depositStatus'
        render={({ depositStatus, mail, userName }: any): any=> {
          if (!depositStatus) {
            return (
              <Popconfirm
                title={`${userName}様に入金を催促するメールを送りますか？`}
                onConfirm={() => window.open(`https://mail.google.com/mail/?view=cm&to=${mail}&su=入金のお願い&body=入金されていません．`, '_blank')}
              >
                <Button>催促</Button>
              </Popconfirm>
            )
          }

        }}
      />
      <Column
        title='発送'
        dataIndex='shipmentStatus'
        key='shipmentStatus'
      />
      <Column
        title='編集'
        key='edit'
        render={({ id }: { id: string}) => (
          <Button
            onClick={() => pushToEditPage(id)}
          >
            編集
          </Button>
        )}
      />
    </Table>
  </div>
)

export default ProductList
