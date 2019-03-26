import * as React from 'react'

import { parse } from 'query-string'
import { read } from '../firebase/database'

class Print extends React.Component<any> {
  constructor(props: any) {
    super(props)
    document.getElementsByTagName('body')[0].classList.add('A4')
    this.state = { prints: [] }
  }

  async componentDidMount() {
    const { location } = this.props
    let { productKeys }: any = parse(location.search)

    let a: any = []

    if (typeof productKeys !== 'object') {
      productKeys = [productKeys]
    }

    productKeys.forEach(async (productKey: string, i: number) => {
      const d = await read(`orders/${productKey}`)
      const { address, userName, id } = d.val()
      const addressNumber = address.slice(1, 9).replace(/-/g, '')
      const addressLine = address.slice(9, address.length)
      a.push({ addressNumber, addressLine, userName, id })

      const pageIndex = a.length / 6
      let printData: any = []
      for (let i = 0; i < pageIndex; i++) {
        printData[i] = a.slice(i * 6, (i + 1) * 6)
      }
      this.setState({ prints: printData })
      setTimeout(() => {
        window.print()
      }, 1000)
    })
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('A4')
  }

  render() {
    const { prints }: any = this.state
    return (
      <div>
        {prints.map((eachPageContent: any, index: number) => {
          return (
            <section className="sheet" key={index}>
              {eachPageContent.map((data: any, i: number) => (
                <div
                  key={i}
                  style={{
                    height: 'calc(100% / 3 - 10px)',
                    width: 'calc(50% - 10px)',
                    float: 'left',
                    margin: '5px',
                  }}
                >
                  <p
                    style={{
                      height: '16.8px',
                      margin: '20px 0 0 30px',
                      letterSpacing: '9px',
                      fontSize: '15px',
                    }}
                  >
                    {data.addressNumber}
                  </p>
                  <p
                    style={{
                      height: '16.8px',
                      margin: '15px 0 0 50px',
                      fontSize: '15px',
                    }}
                  >
                    {data.addressLine}
                  </p>
                  <p
                    style={{
                      height: '18.4px',
                      margin: '43px 0 0 80px',
                    }}
                  >
                    {data.userName}
                  </p>
                  <p
                    style={{
                      margin: '80px 0 0 30px',
                      letterSpacing: '9px',
                      fontSize: '15px',
                    }}
                  >
                    1919810
                  </p>
                  <p
                    style={{
                      margin: '15px 0 0 40px',
                    }}
                  >
                    東京都世田谷区豪徳寺
                  </p>
                  <p
                    style={{
                      margin: '10px 0 0 80px',
                    }}
                  >
                    今井美槻
                  </p>
                  <p
                    style={{
                      margin: '30px 0 0 150px',
                    }}
                  >
                    {data.id}
                  </p>
                </div>
              ))}
            </section>
          )
        })}
      </div>
    )
  }
}

export default Print
