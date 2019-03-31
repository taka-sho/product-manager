import * as React from 'react'
import {
  Button,
  Popconfirm,
  Table,
  Tag,
  Icon,
  Input,
  message,
  Select,
  Spin,
} from 'antd'
import * as moment from 'moment'

const { Column } = Table

import { State, StateUpdates } from '../containers/ProductList'

type ViewProps = State & StateUpdates

type ActionProps = {
  pushToEditPage: (id: string) => void
  pushToPrintPage: () => void
  changeProductStatus: (id: string, productStatus: string) => void
  changeDepositStatus: (id: string, depositStatus: string) => void
  onSendProduct: (
    id: string,
    shipmentNumber: number,
    shipmentStatus: string
  ) => void
  done: (id: string) => void
  onChangeFilter: (filter: string) => void
}

type Props = ViewProps & ActionProps

const ProductList: React.SFC<any> = ({
  current,
  pushToEditPage,
  pushToPrintPage,
  dataSource,
  selectedRowKeys,
  isLoading,
  onChangeSelection,
  onChangePatigation,
  onSendProduct,
  onSendWarningMessage,
  onChangeFilter,
  changeProductStatus,
  changeDepositStatus,
  done,
}) => (
  <Spin spinning={isLoading} tip="読み込み中">
    <Button disabled={!selectedRowKeys.length} onClick={pushToPrintPage}>
      送り状印刷
    </Button>
    <Select
      style={{ width: '200px' }}
      defaultValue="all"
      onChange={onChangeFilter}
    >
      <Select.Option value="all" key="0">
        All
      </Select.Option>
      <Select.Option value="progress" key="1">
        Progress
      </Select.Option>
      <Select.Option value="done" key="2">
        Done
      </Select.Option>
    </Select>
    <Table
      dataSource={dataSource}
      bordered={true}
      rowSelection={{
        selectedRowKeys,
        onChange: onChangeSelection,
        getCheckboxProps: ({ productStatus, depositStatus }) => ({
          disabled: productStatus === '0' || !depositStatus,
        }),
      }}
      pagination={{ current }}
      onChange={onChangePatigation}
    >
      <Column title="注文ID" dataIndex="id" key="id" align="center" />
      <Column title="購入者名" dataIndex="userName" key="userName" />
      <Column
        title="商品内容"
        key="products"
        render={({ products }: any): any => {
          if (products) {
            return Object.keys(products).map(
              (key: string, i: number): any => {
                const regKey = key.toLowerCase()
                if (regKey.match(/tomix/)) {
                  return (
                    <div key={i}>
                      <Tag color="#108ee9">{key}</Tag>: {products[key]}
                    </div>
                  )
                } else if (regKey.match(/kato/)) {
                  return (
                    <div key={i}>
                      <Tag color="#003300">{key}</Tag>: {products[key]}
                    </div>
                  )
                } else if (regKey.match(/micro/)) {
                  return (
                    <div key={i}>
                      <Tag color="#F40301">{key}</Tag>: {products[key]}
                    </div>
                  )
                } else {
                  return (
                    <div key={i}>
                      <Tag>{key}</Tag>: {products[key]}
                    </div>
                  )
                }
              }
            )
          }
        }}
      />
      <Column title="合計金額" dataIndex="price" key="price" align="center" />
      <Column
        title="商品状態"
        key="productStatus"
        align="center"
        render={({ productStatus, id }: any): any => {
          switch (productStatus) {
            case '0':
              return (
                <Popconfirm
                  title="手配済みにしますか？"
                  onConfirm={() => changeProductStatus(id, '1')}
                >
                  <Tag color="#f50">手配中</Tag>
                </Popconfirm>
              )
            case '1':
              return <Tag color="blue">済</Tag>
          }
        }}
      />
      <Column
        title="入金確認"
        key="depositStatus"
        render={({
          depositStatus,
          mail,
          userName,
          id,
          address,
          orderDate,
          products,
          price,
        }: any): any => {
          if (!depositStatus) {
            return (
              <div>
                <Popconfirm
                  title={`${userName}様(${mail})に入金確認完了のメールを送りますか？`}
                  onConfirm={() => {
                    changeDepositStatus(
                      id,
                      moment().format('YYYY/MM/DD'),
                      mail,
                      address,
                      userName,
                      orderDate,
                      products,
                      price
                    )
                  }}
                >
                  <Tag color="#f50">
                    未入金{moment().diff(orderDate, 'days')}日
                  </Tag>
                </Popconfirm>
                <Popconfirm
                  title={`${userName}様(${mail})に入金を催促するメールを送りますか？`}
                  onConfirm={() => {
                    onSendWarningMessage(
                      id,
                      moment().format('YYYY/MM/DD'),
                      mail,
                      address,
                      userName,
                      orderDate,
                      products,
                      price
                    )
                    // window.open(
                    //   `https://mail.google.com/mail/?view=cm&to=${mail}&su=入金のお願い&body=入金されていません．`,
                    //   '_blank'
                    // )
                  }}
                >
                  <Button size="small" type="danger">
                    催促
                  </Button>
                </Popconfirm>
              </div>
            )
          } else {
            return depositStatus
          }
        }}
      />
      <Column
        title="発送"
        key="shipmentStatus"
        render={({
          id,
          shipmentStatus,
          shipmentNumber,
          mail,
          userName,
          address,
          products,
          orderDate,
          price,
        }): any => {
          if (shipmentNumber && shipmentStatus) {
            shipmentNumber = String(shipmentNumber)
            const displayShipmentNumber = `${shipmentNumber.slice(
              0,
              4
            )}-${shipmentNumber.slice(4, 8)}-${shipmentNumber.slice(8)}`
            return (
              <div>
                <p>{shipmentStatus}</p>
                <p>{displayShipmentNumber}</p>
              </div>
            )
          } else {
            return (
              <Input.Search
                placeholder="input search text"
                enterButton="出荷"
                size="small"
                onSearch={(num: string) => {
                  if (typeof num && num.length === 12) {
                    onSendProduct({
                      id,
                      shipmentNumber: Number(num),
                      shipmentStatus: moment().format('YYYY/MM/DD'),
                      mail,
                      userName,
                      address,
                      products,
                      orderDate,
                      price,
                    })
                  } else {
                    message.error('12桁の半角の数字を打ち込んでください')
                  }
                }}
              />
            )
          }
        }}
      />
      <Column
        title="編集"
        key="edit"
        align="center"
        render={({ id }: { id: string }) => (
          <Button size="small" onClick={() => pushToEditPage(id)}>
            編集
          </Button>
        )}
      />
      <Column
        title="DONE"
        key="done"
        align="center"
        render={({ id, doneProduct }: any) =>
          !doneProduct ? (
            <Popconfirm title="DONEにしますか" onConfirm={() => done(id)}>
              <Button type="danger" size="small">
                DONE
              </Button>
            </Popconfirm>
          ) : null
        }
      />
    </Table>
  </Spin>
)

export default ProductList
