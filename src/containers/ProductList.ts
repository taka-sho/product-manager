import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { stringify } from 'query-string'

import { Order } from '../types'
import ProductList from '../components/ProductList'
import { listenStart, read, set } from '../firebase/database'

export type State = {
  allData: Order[]
  current: number
  dataSource: Order[]
  selectedRowKeys: string[]
  selectedData: Order[]
}

export type StateUpdates = {
  onChangeSelection: (selectedRowKeys: string[], selectedRowData: []) => Object
  onChangeFilter: (filterType: string) => Object
  changeCurrentPage: (current: number) => Object
  reciveData: (dataSource: Order[]) => Object
}

const State = withStateHandlers<State, StateUpdates>(
  {
    allData: [],
    current: 1,
    dataSource: [],
    selectedData: [],
    selectedRowKeys: [],
  },
  {
    onChangeSelection: () => (selectedRowKeys: any, selectedData: any) => ({
      selectedRowKeys,
      selectedData,
    }),
    onChangeFilter: ({ allData }) => (filterType: string) => {
      switch (filterType) {
        case 'all':
          return { dataSource: allData }
        case 'done':
          const done = allData
            .map((v: any) => (v.doneProduct ? v : null))
            .filter((v: any) => v)
          return { dataSource: done }
        case 'progress':
          const progress = allData
            .map((v: any) => (!v.doneProduct ? v : null))
            .filter((v: any) => v)
          return { dataSource: progress }
        default:
          return { dataSource: [] }
      }
    },
    reciveData: () => (dataSource: Order[]) => ({
      allData: dataSource,
      dataSource,
    }),
    changeCurrentPage: () => current => ({ current }),
  }
)

type HandlersProps = RouteComponentProps & State & StateUpdates

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
  fetchData: ({ reciveData }: any) => () => {
    listenStart('/orders', (val: any) => {
      let dataSource: any = []
      Object.keys(val).forEach(key => {
        dataSource.push(val[key])
      })
      reciveData(dataSource)
    })
  },
  onChangePatigation: ({ history, changeCurrentPage }) => ({
    current,
  }: any) => {
    history.push(`/products/${current}`)
    changeCurrentPage(current)
  },
})

const LifeCycle = lifecycle<RouteComponentProps, any, any>({
  componentDidMount() {
    read('/orders').catch(() => this.props.history.push('/'))
    this.props.fetchData()
  },
})

const Wrapper = compose(
  withRouter,
  State,
  Handlers,
  LifeCycle
)(ProductList)

export default Wrapper
