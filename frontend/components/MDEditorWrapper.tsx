import { useFormikContext } from "formik";
import dynamic from "next/dynamic";
import rehypeSanitize from 'rehype-sanitize';

export const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
    ssr: false,
})

export const MDEditorWrapper = ({ fieldId, mode, height='50vh' }: { height?:string, fieldId: string; mode: string; }) => {
    const cxt = useFormikContext();
    const { value } = cxt.getFieldMeta(fieldId);

    return (
        <>
            <div data-color-mode="light">

                <MDEditor
                    value={(value as string) ?? ""}
                    onChange={(val) => cxt.setFieldValue(fieldId, val)}
                    className='px-3 py-4 min-h-full border-black bg-slate-50 border w-full'
                    textareaProps={{ rows: 40 }}
                    height={height}
                    preview={mode as any}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }} />
            </div>

        </>
    );
};
