import { my_email } from '../data/content.js'

export default function FooterBlock() {
  return (
    <footer id="contact" className="foot_block">
      <p className="mono_kicker">$ curl -X POST hire/pratyush</p>
      <a href={`mailto:${my_email}`} className="big_mail">{my_email}</a>
      <p className="foot_small">B.Tech Computer Science &amp; Engineering · Vellore Institute of Technology, Amaravati · 2023–2027</p>
    </footer>
  )
}
