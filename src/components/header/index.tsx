import { FC } from 'react'
import { SignInButton, ActiveLink } from 'components'
import styles from './styles.module.scss'

const Header: FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src='/images/ig.news.svg' alt='Logotipo IG.News' />
        <nav>
          <ActiveLink activeClassName={styles.active} href='/'>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}

export default Header
