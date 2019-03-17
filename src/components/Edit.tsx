import * as React from 'react'

import { read } from '../firebase/database'

import * as moment from 'moment'

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

const log = (v: any) => {
  console.log(moment())
  console.log(v)
}

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

class Edit extends React.Component <any> {
  constructor (props: any) {
    super(props)
    this.state = {
      data: [
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
      ]
    }
    read(`products/${this.props.match.params.id}`).then((v: any) => {
      const data = v.val()
      console.log(data)
      this.setState({data})
    })
  }

  render () {
    const { form, match } = this.props
    const { data }: any = this.state
    return (
      <Form
        onSubmit={(e: any) => {
          form.validateFieldsAndScroll((err: Error, values: any) => {
            if (!err) {
              console.log(values)
            }
          })
        }}
        {...formItemLayout}
      >
        <Item label='購入者名'>
          {
            form.getFieldDecorator('userName', {
              initialValue: data.userName,
              rules: [
                { required: true, message: '注文者名は必須です' }
              ]
            })(<Input placeholder='購入者名を入れてください' /> )
          }
        </Item>
        <Item label='商品内容'>
          {
            form.getFieldDecorator('description', {
              initialValue: data.description,
              rules: [
                { required: true, message: '商品内容は必須です' }
              ]
            })(<TextArea rows={3} />)
          }
        </Item>
        <Item label='商品状態'>
          {
            form.getFieldDecorator('productStatus', {
              initialValue: data.productStatus,
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
              initialValue: data.depositStatus ? moment(data.depositStatus) : null,
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
              initialValue: data.depositMail,
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
              initialValue: data.shipmentStatus? moment(data.shipmentStatus): null,
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
              initialValue: data.shipmentMail,
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
    )
  }
}

const wrapper =Form.create({ name: 'register' })(Edit)

export default wrapper
