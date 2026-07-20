import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import styles from './ListPage.module.css'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className={styles.wrap}>
      <p className={styles.status}>Page not found. <Link to="/">Back home</Link></p>
    </div>
  )
}
