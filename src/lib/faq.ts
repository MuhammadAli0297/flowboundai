// Blog posts already write a real "## FAQ" section directly in their Markdown body (see
// CLAUDE.md's "Internal linking minimums" note): a bold question on its own line, followed by a
// plain-text answer that may wrap across several lines and may contain Markdown links. This pulls
// those Q&A pairs out of the raw, unrendered body (Astro's glob loader keeps `entry.body` around
// for exactly this) so `[slug].astro` can emit FAQPage schema without any post needing its FAQ
// content duplicated into frontmatter.

export interface ParsedFaq {
  question: string
  answer: string
}

const FAQ_HEADING = /^##\s*FAQ\s*$/m
const NEXT_HEADING = /^##\s+/m
const QA_PAIR = /^\*\*(.+?)\*\*\s*\n([\s\S]+)$/

function toPlainText(markdown: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/`([^`]+)`/g, "$1") // `code` -> code
    .replace(/\s+/g, " ")
    .trim()
}

export function parseFaqFromMarkdown(body: string): ParsedFaq[] {
  const headingMatch = FAQ_HEADING.exec(body)
  if (!headingMatch) return []

  let section = body.slice(headingMatch.index + headingMatch[0].length)
  const nextHeading = NEXT_HEADING.exec(section)
  if (nextHeading) section = section.slice(0, nextHeading.index)

  return section
    .trim()
    .split(/\n{2,}/)
    .map((block) => QA_PAIR.exec(block.trim()))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => ({
      question: toPlainText(match[1]),
      answer: toPlainText(match[2]),
    }))
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0)
}
