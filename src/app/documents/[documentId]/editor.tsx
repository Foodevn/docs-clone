"use client";

import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import ImageResize from "tiptap-extension-resize-image"
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { EditorContent, useEditor } from '@tiptap/react'

import { useEditorStore } from "@/stores/use-editor-store";
import { FontSizeExtension } from '@/extensions/font-size'
import { LineHeightExtension } from '@/extensions/line-height';
import { Ruler } from './ruler';
import { usePermission } from '@/components/auth/permission';

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from './threads';

export const Editor = () => {
  const { setEditor } = useEditorStore();
  const permission = usePermission().permission;
  const documentId = usePermission().documentId;
  const canEdit = permission.canEdit;
  const topPadding = canEdit ? 'pt-[114px]' : 'pt-[64px]';

  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    editable: permission.canEdit,//quyền trỉnh sửa trong editor

    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px;",
        class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor text",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal"
      }),
      FontSizeExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"

      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      FontFamily,
      Underline,
      Image,
      ImageResize,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
    ],
  })

  return (
    <div className={`${topPadding} print:pt-0`}>
      <div className='size-full overflow-x-auto bg-[#F9FEFD] px-4 print:p-0 print:bg-white print:overflow-visible'>
        {canEdit && (<Ruler />)}
        <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
          <EditorContent editor={editor} />
          <Threads editor={editor} />
        </div>
      </div>
    </div>
  );
};