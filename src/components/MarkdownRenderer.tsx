import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Define the type for the props we are passing in
interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* Maps # Header 1 to TAN Mon Cheri */
          h1: ({node, ...props}) => <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '3rem', fontWeight: 'normal', margin: '2.5rem 0 1rem 0' }} {...props} />,
          
          /* Maps ## Header 2 to EB Garamond */
          h2: ({node, ...props}) => <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: '2rem', margin: '2rem 0 1rem 0', fontWeight: 'normal' }} {...props} />,
          
          /* Maps standard paragraphs to Lora */
          p: ({node, ...props}) => <p style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '1.5rem' }} {...props} />,
          
          /* Maps [links](url) to inherit your text color */
          a: ({node, ...props}) => <a style={{ color: 'var(--text-color)', textDecoration: 'underline', textUnderlineOffset: '4px' }} {...props} />,
          
          /* Maps > blockquotes to a styled box */
          blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid var(--text-color)', paddingLeft: '1.5rem', fontStyle: 'italic', margin: '2rem 0', opacity: 0.8 }} {...props} />,
          
          /* Maps bulleted lists */
          ul: ({node, ...props}) => <ul style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '2rem' }} {...props} />,
          li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          /* THE NEW CODE BLOCK RULE */
          code(props) {
            const {children, className, node, ref, ...rest} = props;
            // Checks if you wrote ```python or ```javascript
            const match = /language-(\w+)/.exec(className || '');
            
            return match ? (
              // We removed the inline style from this div, as customStyle handles it now
              <div>
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={vscDarkPlus}
                  // 1. THIS STYLES THE DARK BOX
                  customStyle={{
                    padding: '2rem', // Lots of breathing room
                    borderRadius: '12px', // Smooth, rounded corners
                    backgroundColor: '#0d1117', // A deeper, richer dark mode background
                    margin: '2rem 0', // Spacing above and below the code block
                  }}
                  // 2. THIS STYLES THE TEXT INSIDE
                  codeTagProps={{
                    style: {
                      fontFamily: "'JetBrains Mono', Consolas, monospace", // Your new premium font
                      fontSize: '1.15rem', // Bigger text
                      lineHeight: '1.6', // Better spacing between lines
                    }
                  }}
                />
              </div>
            ) : (
                // Update the fontFamily here to match!
              <code {...rest} style={{ backgroundColor: 'var(--btn-bg)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: "'JetBrains Mono', Consolas, monospace", color: 'var(--text-color)' }}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}