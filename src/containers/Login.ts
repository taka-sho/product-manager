import { compose, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Login from '../components/Login'
import { signIn } from '../firebase/auth'

export type State = {
  email: string
  pass: string
}

const Handlers = withHandlers<RouteComponentProps & State, {}>({
  signIn: ({ email, pass, history }) => () => {
    signIn(email, pass).then(() => {
      history.push('/products/1')
    })
  },
})

export type StateUpdates = {
  onChangeState: ({ key, value }: { key: string; value: string }) => Object
}

const StateHandlers = withStateHandlers<State, StateUpdates>(
  { email: '', pass: '' },
  {
    onChangeState: () => ({ key, value }) => ({ [key]: value }),
  }
)

const Wrapper = compose(
  StateHandlers,
  Handlers,
  withRouter
)(Login)

export default Wrapper
