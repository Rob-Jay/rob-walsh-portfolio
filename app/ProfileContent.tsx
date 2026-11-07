import { CONVERSATIONS } from '../src/data/conversations.js'

function MessageText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((block, i) => {
        const lines = block.split('\n')
        const isList = lines.every((line) => /^[•\-]\s/.test(line))
        if (isList) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{line.replace(/^[•\-]\s+/, '')}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{lines.join(' ')}</p>
      })}
    </>
  )
}

// The chat streams this same content in the browser, so it is missing from the
// initial HTML. Rendering it here gives crawlers and screen readers the real text.
export default function ProfileContent() {
  return (
    <article className="ssr-profile">
      <h2>Rob Walsh, Senior Software Engineer</h2>
      {CONVERSATIONS.map((conversation) => (
        <section key={conversation.id}>
          <h3>{conversation.title}</h3>
          {conversation.thread
            .filter((message) => message.role === 'assistant')
            .map((message, i) => (
              <MessageText key={i} text={message.content} />
            ))}
        </section>
      ))}
    </article>
  )
}
