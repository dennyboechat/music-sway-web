export interface RichTextEditorProps {
    id: string;
    value: string;
    onChange: (content: string) => {};
    className: string;
}