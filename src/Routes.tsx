import * as React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

const Hello = () => <h1>Hello, World!</h1>
import NewProduct from './components/NewProduct'
import ProductList from './components/ProductList'
import Edit from './components/Edit'

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={'/'} component={Hello} />
      <Route exact={true} path={'/products'} component={ProductList} />
      <Route exact={true} path={'/product/new'} component={NewProduct} />
      <Route exact={true} path={'/product/edit/:id'} component={Edit} />
    </Switch>
  </Router>
)
