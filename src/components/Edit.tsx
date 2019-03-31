import * as React from 'react'
import * as moment from 'moment'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { Formik, FormikActions, FormikProps } from 'formik'

const { Item } = Form
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

type FormValues = {
  userName: string
  products: string
  productStatus: string
  depositStatus: string
  shipmentStatus: string
}

type ViewProps = {
  initialValues: FormValues
}

type ActionType = {
  onSubmit: (data: FormValues, actions: FormikActions<FormValues>) => void
}

type Props = ViewProps & ActionType

type FormProps = FormikProps<FormValues>

const EditForm: React.SFC<FormProps> = ({
  handleSubmit,
  handleChange,
  setFieldValue,
  values,
}) => (
  <Form onSubmit={handleSubmit} {...formItemLayout}>
    <Item label="購入者名">
      <Input
        type="text"
        placeholder="購入者名を入れてください"
        name="userName"
        value={values.userName}
        onChange={handleChange}
      />
    </Item>
    <Item label="商品内容">
      <TextArea
        rows={3}
        name="products"
        value={values.products}
        onChange={handleChange}
      />
    </Item>
    <Item label="商品状態">
      <Select
        value={values.productStatus}
        onChange={value => setFieldValue('productStatus', value)}
      >
        <Option value="0" key="0">
          手配中
        </Option>
        <Option value="1" key="1">
          入荷中
        </Option>
      </Select>
    </Item>
    <Item label="入金日">
      <DatePicker
        name="depositStatus"
        format="YYYY年MM月DD日"
        value={values.depositStatus ? moment(values.depositStatus) : undefined}
        onChange={value => {
          if (value) {
            setFieldValue('depositStatus', value.format('YYYY/MM/DD'))
          } else {
            setFieldValue('depositStatus', '')
          }
        }}
      />
    </Item>
    <Item label="発送">
      <DatePicker
        format="YYYY年MM月DD日"
        value={
          values.shipmentStatus ? moment(values.shipmentStatus) : undefined
        }
        onChange={value => {
          if (value) {
            setFieldValue('shipmentStatus', value.format('YYYY/MM/DD'))
          } else {
            setFieldValue('shipmentStatus', '')
          }
        }}
      />
    </Item>
    <Item label="" {...tailFormItemLayout}>
      <Button type="primary" htmlType="submit">
        変更
      </Button>
    </Item>
  </Form>
)

const Edit: React.SFC<Props> = ({ initialValues, onSubmit }) => (
  <Formik
    initialValues={initialValues}
    enableReinitialize={true}
    onSubmit={onSubmit}
    render={EditForm}
  />
)

export default Edit
