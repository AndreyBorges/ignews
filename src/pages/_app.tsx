import { AppProps } from 'next/app'
import { FC } from 'react'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

import 'styles/global.scss'
import { Header } from 'components'
import { Session } from 'next-auth'

const MyApp: FC<AppProps<{ session: Session }>> = ({ Component, pageProps }) => {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
