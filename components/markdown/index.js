import ReactMarkdown from 'react-markdown';

export default function Markdown({ content, className }) {

    return (
        <ReactMarkdown
            className={className}
        >
            {content}
        </ReactMarkdown>
    );
};