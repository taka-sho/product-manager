import { compose, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Login from '../components/Login'
import { signIn } from '../firebase/auth'

export type State = {
  email: string
  isLoading: boolean
  pass: string
}

const Handlers = withHandlers<RouteComponentProps & State, {}>({
  clickSignIn: ({ history, loading, email, pass }: any) => () => {
    loading()
    signIn(email, pass).then(() => {
      history.push('/products/1')
    })
  },
})

export type StateUpdates = {
  onChangeState: ({ key, value }: { key: string; value: string }) => Object
  loading: () => Object
}

const StateHandlers = withStateHandlers<State, StateUpdates>(
  { email: '', isLoading: false, pass: '' },
  {
    onChangeState: () => ({ key, value }) => ({ [key]: value }),
    loading: () => () => ({ isLoading: true }),
  }
)

const Wrapper = compose(
  StateHandlers,
  Handlers,
  withRouter
)(Login)

export default Wrapper
