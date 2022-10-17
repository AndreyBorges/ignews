import { query as q } from 'faunadb'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from 'services'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GUTHUB_CLIENT_ID,
      clientSecret: process.env.GUTHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      try {
        const useActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active')
            ])
          )
        )

        return {
          ...session,
          activeSubscription: useActiveSubscription
        }
      } catch (err) {
        console.log('Erro', err)
        return {
          ...session,
          activeSubscription: null
        }
      }

      return session
    },
    async signIn({ user, account, profile }) {
      try {
        const { email } = user
        await fauna.query(
          q.If(
            q.Not(q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(user.email)))),
            q.Create(q.Collection('users'), {
              data: { email }
            }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email)))
          )
        )

        return true
      } catch (err) {
        console.log('Erro', err)
        return false
      }
    }
  }
})
