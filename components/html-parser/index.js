import parse from 'html-react-parser';

const HtmlParser = ({ content }) => {
    return (
        <div>
            {parse(content)}
        </div>
    );
};

export default HtmlParser;