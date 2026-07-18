import { Link } from 'react-router-dom'
import styles from './ListPage.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <p className={styles.status}>Page not found. <Link to="/">Back home</Link></p>
    </div>
  )
}
