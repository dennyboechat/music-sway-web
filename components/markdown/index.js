import ReactMarkdown from 'react-markdown';

const Markdown = ({ content, className }) => {
    return (
        <ReactMarkdown className={className}>
            {content}
        </ReactMarkdown>
    );
};

export default Markdown;