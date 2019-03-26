import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { stringify } from 'query-string'

import { Order } from '../types'
import ProductList from '../components/ProductList'
import { listenStart, read, set } from '../firebase/database'

export type State = {
  dataSource: Order[]
  sortedData: Order[]
  selectedRowKeys: string[]
  selectedData: Order[]
}

export type StateUpdates = {
  onChangeSelection: (selectedRowKeys: string[], selectedRowData: []) => Object
  onChangeFilter: (filterType: string) => Object
}

const State = withStateHandlers<State, {}>(
  state => {
    // let dataSource: Order[] = []
    // let sortedData: Order[] = []
    // read('/oreders')
    //   .then((snapshot) => {
    //     const val = snapshot.val()
    //     Object.keys(val).forEach((key) => {
    //       dataSource.push(val[key])
    //     })
    //   })
    return {
      dataSource: [],
      sortedData: [],
      selectedData: [],
      selectedRowKeys: [],
    }
  },
  {}
  // {
  //   dataSource: [],
  //   sortedData: [],
  //   selectedData: [],
  //   selectedRowKeys: []
  // },
  // {
  //   onChangeSelection: () => (selectedRowKeys, selectedData) => ({ selectedRowKeys, selectedData }),
  //   onChangeFilter: (state) => async (filterType) => {
  //     console.log(state)
  //     let dataSource: Order[] = []
  //     const snapshot = await read('orders/')
  //     const val = snapshot.val()
  //     Object.keys(val).forEach((key) => {
  //       dataSource.push(val[key])
  //     })

  //     return { dataSource }
  //   }
  // }
)

type HandlersProps = RouteComponentProps & State

const Handlers = withHandlers<HandlersProps, {}>({
  pushToPrintPage: ({ history, selectedRowKeys }) => () => {
    history.push({
      pathname: '/print',
      search: stringify({ productKeys: selectedRowKeys }),
    })
  },
  pushToEditPage: ({ history }) => (id: string) => {
    history.push(`product/edit/${id}`)
  },
  changeProductStatus: () => (id: string, productStatus: string) => {
    set(`orders/${id}`, { productStatus })
  },
  changeDepositStatus: () => (id: string, depositStatus: string) => {
    set(`orders/${id}`, { depositStatus })
  },
  onSendProduct: () => (
    id: string,
    shipmentNumber: number,
    shipmentStatus: string
  ) => {
    set(`orders/${id}`, { shipmentNumber, shipmentStatus })
  },
  done: () => (id: string) => {
    set(`orders/${id}`, { doneProduct: true })
  },
})

const LifeCycle = lifecycle<RouteComponentProps, any>({
  componentDidMount() {
    read('/orders').catch(() => this.props.history.push('/'))
    listenStart('/orders', (val: any) => {
      let dataSource: any = []
      Object.keys(val).forEach(key => {
        dataSource.push(val[key])
      })
      this.setState({ dataSource })
    })
  },
})

const Wrapper = compose(
  State,
  LifeCycle,
  Handlers,
  withRouter
)(ProductList)

export default Wrapper
