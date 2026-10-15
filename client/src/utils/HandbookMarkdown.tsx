import React from 'react'

// Renders the lightweight Markdown stored in HandbookSection.content as React
// elements (never raw HTML), so admin-entered text can't inject markup.
// Supported: blank-line paragraphs, "### " sub-headings, "- " and "1. " lists
// (nested by indenting), "| a | b |" tables (a "|---|" second row makes the
// first row a header), **bold**, [text](url) links and bare URLs / emails.

type ListNode = { ordered: boolean; items: { text: string; children: ListNode[] }[] };
type Block =
    | { kind: 'heading'; text: string }
    | { kind: 'paragraph'; text: string }
    | { kind: 'list'; list: ListNode }
    | { kind: 'table'; header: string[] | null; rows: string[][] };

const LIST_RE = /^(\s*)(-|\*|\d+\.)\s+(.*)$/;
const TABLE_SEPARATOR_RE = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

const splitRow = (line: string) =>
    line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

const parseList = (lines: string[]): ListNode => {
    const root: ListNode = { ordered: /^\s*\d+\./.test(lines[0]), items: [] };
    // Stack of [indent, list] so deeper indents nest under the previous item.
    const stack: { indent: number; list: ListNode }[] = [{ indent: LIST_RE.exec(lines[0])![1].length, list: root }];
    for (const line of lines) {
        const [, spaces, marker, text] = LIST_RE.exec(line)!;
        const indent = spaces.length;
        while (stack.length > 1 && indent < stack[stack.length - 1].indent) stack.pop();
        let top = stack[stack.length - 1];
        if (indent > top.indent && top.list.items.length > 0) {
            const child: ListNode = { ordered: /\d/.test(marker), items: [] };
            top.list.items[top.list.items.length - 1].children.push(child);
            stack.push({ indent, list: child });
            top = stack[stack.length - 1];
        }
        top.list.items.push({ text, children: [] });
    }
    return root;
};

export const parseHandbookMarkdown = (source: string): Block[] => {
    const lines = source.replace(/\r\n?/g, '\n').split('\n');
    const blocks: Block[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }

        if (/^#{1,6}\s+/.test(line)) {
            blocks.push({ kind: 'heading', text: line.replace(/^#{1,6}\s+/, '').trim() });
            i++;
            continue;
        }

        if (line.trim().startsWith('|')) {
            const rows: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++]);
            const hasHeader = rows.length > 1 && TABLE_SEPARATOR_RE.test(rows[1].trim());
            blocks.push({
                kind: 'table',
                header: hasHeader ? splitRow(rows[0]) : null,
                rows: (hasHeader ? rows.slice(2) : rows).map(splitRow),
            });
            continue;
        }

        if (LIST_RE.test(line)) {
            const items: string[] = [];
            while (i < lines.length && LIST_RE.test(lines[i])) items.push(lines[i++]);
            blocks.push({ kind: 'list', list: parseList(items) });
            continue;
        }

        const para: string[] = [];
        while (
            i < lines.length && lines[i].trim() &&
            !/^#{1,6}\s+/.test(lines[i]) && !lines[i].trim().startsWith('|') && !LIST_RE.test(lines[i])
        ) para.push(lines[i++].trim());
        blocks.push({ kind: 'paragraph', text: para.join(' ') });
    }
    return blocks;
};

// Only these link targets are rendered as links; anything else (e.g.
// "javascript:") is shown as plain text.
const safeHref = (url: string): string | null => {
    const u = url.trim();
    if (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(u)) return u;
    if (/^www\./i.test(u)) return `https://${u}`;
    return null;
};

const INLINE_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|((?:https?:\/\/|www\.)[^\s<>()]+[^\s<>().,;:!?'"])|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

const renderInline = (text: string, keyPrefix = ''): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    const re = new RegExp(INLINE_RE.source, 'g');
    while ((match = re.exec(text))) {
        if (match.index > last) out.push(text.slice(last, match.index));
        const key = `${keyPrefix}${match.index}`;
        const [whole, linkText, linkUrl, bold, bareUrl, email] = match;
        if (linkText !== undefined) {
            const href = safeHref(linkUrl);
            out.push(href ? (
                <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-primary font-medium underline underline-offset-2 hover:text-secondary break-words">
                    {renderInline(linkText, `${key}-`)}
                </a>
            ) : whole);
        } else if (bold !== undefined) {
            out.push(<strong key={key} className="font-semibold text-gray-800">{renderInline(bold, `${key}-`)}</strong>);
        } else if (bareUrl !== undefined) {
            const href = safeHref(bareUrl)!;
            out.push(
                <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-secondary break-all">{bareUrl}</a>
            );
        } else if (email !== undefined) {
            out.push(
                <a key={key} href={`mailto:${email}`} className="text-primary underline underline-offset-2 hover:text-secondary break-all">{email}</a>
            );
        }
        last = match.index + whole.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
};

const ListView = ({ list, depth = 0 }: { list: ListNode; depth?: number }) => {
    const Tag = list.ordered ? 'ol' : 'ul';
    const style = list.ordered ? 'list-decimal' : depth === 0 ? 'list-disc' : 'list-[circle]';
    return (
        <Tag className={`${style} flex flex-col gap-1.5 pl-6 marker:text-primary ${depth > 0 ? 'mt-1.5' : ''}`}>
            {list.items.map((item, idx) => (
                <li key={idx} className="pl-1">
                    {renderInline(item.text)}
                    {item.children.map((child, cIdx) => <ListView key={cIdx} list={child} depth={depth + 1} />)}
                </li>
            ))}
        </Tag>
    );
};

const HandbookMarkdown = ({ content }: { content: string }) => {
    const blocks = parseHandbookMarkdown(content || '');
    return (
        <div className="flex flex-col gap-4 text-base leading-relaxed text-secondary-text">
            {blocks.map((block, idx) => {
                switch (block.kind) {
                    case 'heading':
                        return <h3 key={idx} className="text-lg font-bold text-gray-800 mt-2">{renderInline(block.text)}</h3>;
                    case 'paragraph':
                        return <p key={idx}>{renderInline(block.text)}</p>;
                    case 'list':
                        return <ListView key={idx} list={block.list} />;
                    case 'table':
                        return (
                            <div key={idx} className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full text-sm">
                                    {block.header && (
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {block.header.map((cell, cIdx) => (
                                                    <th key={cIdx} className="px-4 py-2.5 text-left font-semibold text-gray-800">{renderInline(cell)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody className="divide-y divide-gray-200">
                                        {block.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="align-top">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx}
                                                        className={`px-4 py-2.5 ${cIdx === 0 && !block.header ? 'font-semibold text-gray-800 sm:whitespace-nowrap' : ''}`}>
                                                        {renderInline(cell)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                }
            })}
        </div>
    );
};

export default HandbookMarkdown
