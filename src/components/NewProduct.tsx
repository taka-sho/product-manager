import * as React from 'react'

import * as moment from 'moment'

import { set, read } from '../firebase/database'

import {
  Button,
  DatePicker,
  Form,
  Input,
  Select
} from 'antd'

const { Item } = Form
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

const NewProduct = ({ form, match }: any) => (
  <div>
    <p>{match.params.id}</p>
    <Form
      onSubmit={(e: any) => {
        form.validateFieldsAndScroll(async(err: Error, values: any) => {

          // date format
          if (!err) {
            if (!values.depositStatus) {
              delete values.depositStatus
            } else {
              values.depositStatus = values.depositStatus.format('YYYY/MM/DD')
            }
            if (!values.shipmentStatus) {
              delete values.shipmentStatus
            } else {
              values.shipmentStatus = values.shipmentStatus.format('YYYY/MM/DD')
            }

            //get db
            const products = await read('/products')
            if (!products.val()) {
              values.id = 'A000'
              values.key = 'A000'
              set('products/A000', values)
              return
            }

            // Generate nextId
            const a = Object.keys(products.val()).sort().slice(-1)[0]
            const idAlph = a[0]
            const idNum = Number(a.substring(1, 4))
            let nextAlph = ''
            let nextNum = ''
            if (idNum === 999) {
              nextAlph = String.fromCharCode(idAlph.charCodeAt(0) + 1)
              nextNum = '000'
            } else {
              nextAlph = idAlph
              nextNum = `00${idNum + 1}`.slice(-3)
            }
            values.id = `${nextAlph}${nextNum}`
            values.key = `${nextAlph}${nextNum}`
            set(`products/${nextAlph}${nextNum}`, values)
          }
        })
      }}
      {...formItemLayout}
    >
      <Item label='購入者名'>
        {
          form.getFieldDecorator('userName', {
            rules: [
              { required: true, message: '注文者名は必須です' }
            ]
          })(<Input placeholder='購入者名を入れてください' /> )
        }
      </Item>
      <Item label='商品内容'>
        {
          form.getFieldDecorator('description', {
            rules: [
              { required: true, message: '商品内容は必須です' }
            ]
          })(<TextArea rows={3} />)
        }
      </Item>
      <Item label='商品状態'>
        {
          form.getFieldDecorator('productStatus', {
            initialValue: '0',
            rules: [
              { required: true, message: '商品状態は必須です' }
            ]
          })(
            <Select>
              <Option value='0' key='0'>手配中</Option>
              <Option value='1' key='1'>入荷中</Option>
              <Option value='2' key='2'>保管中</Option>
            </Select>
          )
        }
      </Item>
      <Item label='入金日'>
        {
          form.getFieldDecorator('depositStatus', {
            rules: [{
              type: 'object',
              required: false,
              message: 'Please select time!'
            }]
          })(
            <DatePicker format='YYYY年MM月DD日'/>
          )
        }
      </Item>
      <Item label='入金確認メール'>
        {
          form.getFieldDecorator('depositMail', {
            initialValue: '0',
            rules: [
              { required: true, message: '商品状態は必須です' }
            ]
          })(
            <Select>
              <Option value='0' key='0'>未送信</Option>
              <Option value='1' key='1'>送信済</Option>
              <Option value='2' key='2'>不達</Option>
            </Select>
          )
        }
      </Item>
      <Item label='発送'>
        {
          form.getFieldDecorator('shipmentStatus', {
            rules: [
              { required: false }
            ]
          })(
            <DatePicker format='YYYY年MM月DD日' />
          )
        }
      </Item>
      <Item label='発送確認メール'>
        {
          form.getFieldDecorator('shipmentMail', {
            initialValue: '0',
            rules: [
              { required: true, message: '商品状態は必須です' }
            ]
          })(
            <Select>
              <Option value='0' key='0'>未送信</Option>
              <Option value='1' key='1'>送信済</Option>
              <Option value='2' key='2'>不達</Option>
            </Select>
          )
        }
      </Item>
      <Item label='' {...tailFormItemLayout}>
        <Button
          type='primary'
          htmlType='submit'
        >
          変更
        </Button>
      </Item>
    </Form>
  </div>
)

const wrapper =Form.create({ name: 'register' })(NewProduct)

export default wrapper
