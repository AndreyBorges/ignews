export type PostAPI = {
  id: string
  uid: string
  url: string | null
  type: string
  href: string
  tags: []
  first_publication_date: string
  last_publication_date: string
  slugs: string[]
  linked_documents: []
  lang: string
  alternate_languages: []
  data: {
    title: {
      type: string
      text: string
      spans: []
    }[]
    content: {
      type: string
      text: string
      spans: []
    }[]
  }
}


export type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

export type PostsProps = {
  posts: Post[]
}
