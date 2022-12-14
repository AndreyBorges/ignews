import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RichText } from 'prismic-dom'
import { FC, useEffect } from 'react'
import { getPrismicClient } from 'services'
import styles from './styles.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

const PostPreview: FC<PostPreviewProps> = ({ post }) => {
  const { data: session }: any = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | IgNews </title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()

  const resp = await prismic.getByUID<any>('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(resp.data.title),
    content: RichText.asHtml(resp.data.content.slice(0, 3)),
    updatedAt: new Date(resp.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { post },
    redirect: 60 * 30 // 30 minutes
  }
}

export default PostPreview
