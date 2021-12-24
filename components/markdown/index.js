import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Markdown = ({ content, className }) => {
    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} className={className}>
            {content}
        </ReactMarkdown>
    );
};

export default Markdown;