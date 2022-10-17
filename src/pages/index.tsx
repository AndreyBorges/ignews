import Head from 'next/head'
import { GetStaticProps } from 'next'
import { SubscriberBtn } from 'components'
import styles from './home.module.scss'
import { stripe } from 'services'
import { FC } from 'react'
import Image from 'next/image'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

const Home: FC<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}</span> month
          </p>
          <SubscriberBtn priceId={product.priceId} />
        </section>
        <Image src='/images/mulher.svg' />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LsqrYGK7uPGHbDiUPcdILpX')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }
  return {
    props: { product },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}

export default Home
