import * as React from 'react'
import * as ReactDom from 'react-dom'

import "antd/dist/antd.css"

import * as fb from 'firebase/'

import Routes from './Routes'

ReactDom.render(
  <Routes />,
  document.getElementById('app')
)
