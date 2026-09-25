import { Link, useParams } from 'react-router-dom'
import { articles } from '../../data/journal'
import { Icon } from '../../components/ui/Icon'

export function JournalCards() { return <div className="journal-grid">{articles.map(article => <Link className="journal-card" key={article.id} to={`/journal/${article.id}`}><div className="journal-image"><img src={article.image} alt={article.title} loading="lazy" width="900" height="650" /><span><Icon name="arrow" /></span></div><div className="journal-meta"><span className="eyebrow">{article.category}</span><span>{article.readTime}</span></div><h3>{article.title}</h3></Link>)}</div> }
export default function JournalPage() { return <section className="journal-page section-shell"><div className="page-intro"><span className="eyebrow">The ORREN journal</span><h1>For a curious mind.<br /><em>And a better cup.</em></h1><p>Stories from the world of coffee, and little things worth knowing.</p></div><JournalCards /></section> }
export function ArticlePage() {
  const { articleId } = useParams()
  const article = articles.find(item => item.id === articleId)
  if (!article) return <section className="not-found section-shell"><h1>That story is still unwritten.</h1><Link to="/journal" className="text-link">Read our field notes <Icon name="right" /></Link></section>
  return <article className="article-page"><div className="article-heading section-shell"><Link to="/journal" className="text-link">← All field notes</Link><span className="eyebrow">{article.category} / {article.readTime}</span><h1>{article.title}</h1><p>{article.intro}</p></div><img className="article-hero" src={article.image} alt={article.title} width="1400" height="800" /><div className="article-body">{article.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<Link to="/shop" className="button button-dark">Put your curiosity in a cup <Icon name="arrow" /></Link></div></article>
}
