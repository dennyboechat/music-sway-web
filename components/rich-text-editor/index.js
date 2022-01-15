import { useEditor, EditorContent, } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import styles from '@/styles/general.module.css';
import MenuBarButton from '@/components/rich-text-editor/menu-bar-button';

const RichTextEditor = ({ id, value, onChange }) => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Color,
            TextStyle,
        ],
        editorProps: {
            attributes: {
                class: styles.ms_rich_text_editor,
            },
        },
        content: value,
        onBlur: ({ editor }) => {
            const text = editor.getHTML();
            if (onChange) {
                onChange(text);
            }
        },
        parseOptions: {
            preserveWhitespace: 'full',
        },
    });

    if (!editor) {
        return null;
    }

    const menuBar = (
        <>
            <MenuBarButton
                label="bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="strike"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="paragraph"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h1"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h2"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h3"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h4"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h5"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="h6"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            />
            <MenuBarButton
                label="bullet list"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="ordered list"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="blockquote"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
            />
            <MenuBarButton
                label="horizontal rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />
            <MenuBarButton
                label="line break"
                onClick={() => editor.chain().focus().setHardBreak().run()}
            />
            <MenuBarButton
                label="undo"
                onClick={() => editor.chain().focus().undo().run()}
            />
            <MenuBarButton
                label="redo"
                onClick={() => editor.chain().focus().redo().run()}
            />
            <input
                type="color"
                onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color}
            />
        </>
    );

    return (
        <>
            {menuBar}
            <EditorContent id={id} editor={editor} />
        </>
    );
}

export default RichTextEditor;