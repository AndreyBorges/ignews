import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { API, getStripeJs } from 'services'
import styles from './styles.module.scss'

interface SubscriberBtnProps {
  priceId: string
}
const SubscriberBtn: FC<SubscriberBtnProps> = ({ priceId }) => {
  const { data: sessions }: any = useSession()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!sessions) {
      signIn('github')
      return
    }

    if (sessions.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const resp = await API.post('/subscribe')
      const { sessionId } = resp.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({
        sessionId
      })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <button onClick={handleSubscribe} type='button' className={styles.subscriberBtn}>
      Subscriber Now
    </button>
  )
}

export default SubscriberBtn
