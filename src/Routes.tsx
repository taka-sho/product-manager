import * as React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import Print from './components/Print'
// import NewProduct from './components/NewProduct'
import ProductList from './containers/ProductList'
import Edit from './containers/Edit'
import Login from './containers/Login'

export default () => (
  <Router>
    <Switch>
      <Route exact={true} path={'/'} component={Login} />
      <Route exact={true} path={'/print'} component={Print} />
      <Route
        exact={true}
        path={'/products/:pageNumber'}
        component={ProductList}
      />
      {/* <Route exact={true} path={'/product/new'} component={NewProduct} /> */}
      <Route exact={true} path={'/product/edit/:id'} component={Edit} />
    </Switch>
  </Router>
)
