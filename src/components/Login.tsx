import * as React from 'react'
import {
  Button,
  Form,
  Icon,
  Input
} from 'antd'

import { State, StateUpdates } from '../containers/Login'

type ViewProps = State & StateUpdates

type ActionProps = {
  signIn: () => void
}

type Props = ViewProps & ActionProps

const Login: React.SFC<Props> = ({
  email,
  pass,
  onChangeState,
  signIn
}) => (
  <Form layout="inline">
    <Form.Item>
      <Input
        prefix={
          <Icon
            type="user"
            style={{ color: 'rgba(0,0,0,.25)' }}
          />
        }
        value={email}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          if (e.target instanceof HTMLInputElement) {
            onChangeState({ key: 'email', value: e.target.value })
          }
        }}
        placeholder="Username"
      />
    </Form.Item>
    <Form.Item>
      <Input
        prefix={
          <Icon
            type="lock"
            style={{ color: 'rgba(0,0,0,.25)' }}
          />
        }
        value={pass}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          if (e.target instanceof HTMLInputElement) {
            onChangeState({ key: 'pass', value: e.target.value })
          }
        }}
        type="password"
        placeholder="Password"
      />
    </Form.Item>
    <Form.Item>
      <Button
        type="primary"
        onClick={signIn}
      >
        Log in
      </Button>
    </Form.Item>
  </Form>
)

export default Login
