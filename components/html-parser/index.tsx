import parse from 'html-react-parser';
import classnames from 'classnames';
import styles from '@/styles/general.module.css';

const HtmlParser = ({ content, className }: { content: string, className?: string }) => {

    className = classnames(styles.html_content, className);

    return (
        <div className={className}>
            {content ? parse(content) : ''}
        </div>
    );
};

export default HtmlParser;