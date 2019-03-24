import {
  compose,
  lifecycle,
  withHandlers,
  withStateHandlers
} from 'recompose'
import {
  RouteComponentProps,
  withRouter
} from 'react-router-dom'
import { stringify } from 'query-string'

import { Order } from '../types'
import ProductList from '../components/ProductList'
import { read } from '../firebase/database'

export type State = {
  dataSource: Order[]
  selectedRowKeys: string[]
  selectedData: Order[]
}

export type StateUpdates = {
  onChangeSelection: (
    selectedRowKeys: string[],
    selectedRowData: []
  ) => Object
}

const State = withStateHandlers　<State, StateUpdates> (
  {
    dataSource: [],
    selectedRowKeys: [],
    selectedData: []
  },
  {
    onChangeSelection: () => (selectedRowKeys, selectedData) => ({ selectedRowKeys, selectedData })
  }
)

type HandlersProps = RouteComponentProps & State

const Handlers = withHandlers <HandlersProps, {}> ({
  pushToPrintPage: ({ history, selectedRowKeys }) => () => {
    history.push({
      pathname: '/print',
      search: stringify({ productKeys: selectedRowKeys })
    })
  },
  pushToEditPage: ({ history }) => (id: string) => {
    history.push(`product/edit/${id}`)
  }
})

const LifeCycle = lifecycle <RouteComponentProps, any> ({
  componentDidMount () {
    read('/orders')
      .then((v: any) => {
        const db = v.val()
        let dataSource: any = []
        Object.keys(db).forEach((key) => {
          dataSource.push(db[key])
        })
        this.setState({ dataSource })
      })
      .catch(() => this.props.history.push('/'))
  }
})

const Wrapper = compose(
    State,
    LifeCycle,
    Handlers,
    withRouter
  )(ProductList)

export default Wrapper
