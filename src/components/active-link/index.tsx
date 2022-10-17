import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { cloneElement, FC, ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  activeClassName: string
}

const ActiveLink: FC<ActiveLinkProps> = ({ children, activeClassName, ...rest }) => {
  const { asPath } = useRouter()

  const className = asPath === rest.href ? activeClassName : ''

  return (
    <Link className={activeClassName} {...rest}>
      {cloneElement(children, { className })}
    </Link>
  )
}

export default ActiveLink
