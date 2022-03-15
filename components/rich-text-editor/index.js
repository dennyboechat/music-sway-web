import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({ id, value, onChange }) => {

    const apiKey = 'k3b0j7q1x0idx8wn23lnultfh5fruhyftlj60f0bydzj2rkc';

    return (
        <div id={`rich_text_editor_wrapper_${id}`}>
            <Editor
                id={`rich_text_editor_${id}`}
                apiKey={apiKey}
                initialValue={value}
                onBlur={(e) => onChange(e.target.getContent())}
                init={{
                    menubar: false,
                    branding: false,
                    statusbar: false,
                    toolbar_sticky: true,
                    force_br_newlines : true,
                    force_p_newlines : false,
                    forced_root_block : '',
                    plugins: 'lists hr autoresize',
                    skin: 'material-outline',
                    content_css: 'material-outline',
                    icons: 'material',
                    toolbar: "bold italic strikethrough | forecolor backcolor | h1 h2 | bullist numlist blockquote hr emoticons | undo redo",
                    content_style: "body { background: #000; color: #FFF; font-size: 16px; font-family: Arial; }",
                }}
            />
        </div>
    );
}

export default RichTextEditor;