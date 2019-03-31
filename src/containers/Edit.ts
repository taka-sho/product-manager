import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Order } from '../types'

import { read, set } from '../firebase/database'
import Edit from '../components/Edit'

export type State = {
  id: string
  initialValues?: Order
}

export type StateUpdates = {}

const State = withStateHandlers<State, StateUpdates>(
  ({ match }: any) => ({
    id: match.params.id,
    initialValues: {
      id: '',
      userName: '',
      products: {},
      productStatus: '',
      depositStatus: '',
      shipmentStatus: '',
      shipmentMail: '',
      key: '',
      doneProduct: false,
    },
  }),
  {
    onChangeProductStatus: () => ({
      key,
      value,
    }: {
      key: string
      value: string
    }) => ({ [key]: value }),
  }
)

type FormValues = {
  userName: string
  products: string
  productStatus: string
  depositStatus: string
  shipmentStatus: string
}

const Handlers = withHandlers<RouteComponentProps & any, {}>({
  onSubmit: props => (values: FormValues) => {
    const splitedValue = values.products.split('\n').map(v => v.split('：'))
    let productsValue: Order['products'] = {}
    splitedValue.forEach(v => {
      productsValue[v[0]] = v[1]
    })
    delete productsValue['']
    values.products = productsValue

    set(`orders/${props.id}`, values).then(() => {
      props.history.push('/products/1')
    })
  },
})

const LifeCycle = lifecycle<RouteComponentProps, {}>({
  componentDidMount() {
    const { id }: any = this.props.match.params
    this.setState({ id })
    read(`orders/${id}`)
      .then((v: any) => {
        const initialValues = v.val()
        let products: Order['products'] = ''
        Object.keys(initialValues.products).forEach(key => {
          products += `${key}：${initialValues.products[key]}\n`
        })
        initialValues.products = products

        this.setState({ initialValues })
      })
      .catch(() => this.props.history.push('/'))
  },
})

const Wrapper = compose(
  State,
  Handlers,
  LifeCycle,
  withRouter
)(Edit)

export default Wrapper
