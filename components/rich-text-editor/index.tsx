import React from 'react';
import { Editor } from "@tinymce/tinymce-react";
import Skeleton from '@mui/material/Skeleton';
import styles from '@/styles/general.module.css';

export const RichTextEditor = ({ id, value, onChange, className }) => {
    const [loading, setLoading] = React.useState(true);
    const apiKey = 'k3b0j7q1x0idx8wn23lnultfh5fruhyftlj60f0bydzj2rkc';

    return (
        <div id="rich_text_editor_wrapper" className={className}>
            {loading &&
                <Skeleton variant="rectangular" height={400} className={styles.rich_text_editor_skeleton} />
            }
            <Editor
                id={id}
                apiKey={apiKey}
                initialValue={value}
                onBlur={(e) => onChange(e.target.getContent())}
                init={{
                    menubar: false,
                    branding: false,
                    statusbar: false,
                    toolbar_sticky: true,
                    paste_as_text: true,
                    plugins: 'lists hr autoresize paste',
                    skin: 'material-outline',
                    content_css: 'material-outline',
                    icons: 'material',
                    toolbar: "bold italic strikethrough | forecolor backcolor | h1 h2 | bullist numlist blockquote hr emoticons | undo redo",
                    content_style: "body { background: #000; color: #fff; font-size: 16px; font-family: Arial; }",
                }}
                onInit={() => {
                    setLoading(false);
                }}
            />
        </div>
    );
}