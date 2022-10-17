import Prismic from '@prismicio/client'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { FC } from 'react'
import { getPrismicClient } from 'services'
import styles from './styles.module.scss'
import { RichText } from 'prismic-dom'
import Link from 'next/link'
import { PostsProps, PostAPI } from 'types'
import { useSession } from 'next-auth/react'

const Posts: FC<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title> Posts | IgNews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/preview/${post.slug}`}>
              <a key={post.slug} href='#'>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const resp = await prismic.query([Prismic.Predicates.at('document.type', 'publication')], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })

  const posts = resp.results.map((postM: PostAPI) => {
    return {
      slug: postM.uid,
      title: RichText.asText(postM.data.title),
      excerpt: postM.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(postM.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: { posts }
  }
}

export default Posts
