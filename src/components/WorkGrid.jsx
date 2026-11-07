import { work_items } from '../data/content.js'

const tag_txt = {
  shipped: '● Running · repo ↗',
  offline: '○ Currently Offline',
  local: '◆ Local Training · ML',
}

function CardInner({ item }) {
  return (
    <>
      <span className={'work_tag tag_' + item.kind}>{item.many_links ? '● Running · 3 repos' : tag_txt[item.kind]}</span>
      <span className="work_name">{item.name}</span>
      <span className="work_blurb">{item.blurb}</span>
      <span className="work_stack">{item.stack}</span>
    </>
  )
}

export default function WorkGrid() {
  return (
    <section id="work" className="sec_block">
      <h2 className="sec_title reveal_up">Workloads</h2>
      <p className="sec_lead reveal_up">Shipped builds link to their repos. Offline builds go live as each one ships.</p>
      <div className="work_grid">
        {work_items.map((item) => {
          // single repo => whole card is the link
          if (item.link) {
            return (
              <a key={item.name} href={item.link} className="work_card card_live reveal_up">
                <CardInner item={item} />
              </a>
            )
          }
          return (
            <div key={item.name} className={item.kind === 'shipped' ? 'work_card card_live reveal_up' : 'work_card card_dim reveal_up'}>
              <CardInner item={item} />
              {item.many_links && (
                <span className="multi_links">
                  {item.many_links.map((l) => <a key={l.url} href={l.url}>{l.txt} ↗</a>)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
