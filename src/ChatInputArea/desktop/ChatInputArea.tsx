import { createStyles } from 'antd-style';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { ReactNode, forwardRef } from 'react';
import useMergeState from 'use-merge-value';

import DraggablePanel, { type DraggablePanelProps } from '@/DraggablePanel';

import ChatInputAreaInner, { type ChatInputAreaInnerProps } from '../ChatInputAreaInner';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding: 12px 0 16px;
    `,
    textarea: css`
      height: 100% !important;
      padding: 0 24px;
      line-height: 1.5;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

export interface ChatInputAreaProps extends Omit<ChatInputAreaInnerProps, 'classNames'> {
  bottomAddons?: ReactNode;
  classNames?: DraggablePanelProps['classNames'];
  expand?: boolean;
  heights?: {
    headerHeight?: number;
    inputHeight?: number;
    minHeight?: number;
  };
  onSizeChange?: DraggablePanelProps['onSizeChange'];
  setExpand?: (expand: boolean) => void;
  topAddons?: ReactNode;
}

const ChatInputArea = forwardRef<TextAreaRef, ChatInputAreaProps>(
  (
    {
      className,
      style,
      classNames,
      expand = false,
      setExpand,
      bottomAddons,
      topAddons,
      onSizeChange,
      heights,
      onSend,
      ...rest
    },
    ref,
  ) => {
    const [fullscreen, setFullscreen] = useMergeState<boolean>(expand, {
      defaultValue: expand,
      onChange: setExpand,
    });
    const { styles } = useStyles();

    return (
      <DraggablePanel
        className={className}
        classNames={classNames}
        fullscreen={fullscreen}
        headerHeight={heights?.headerHeight}
        minHeight={heights?.minHeight}
        onSizeChange={onSizeChange}
        placement="bottom"
        size={{ height: heights?.inputHeight, width: '100%' }}
        style={{ zIndex: 10, ...style }}
      >
        <section className={styles.container} style={{ minHeight: heights?.minHeight }}>
          {topAddons}
          <div className={styles.textareaContainer}>
            <ChatInputAreaInner
              className={styles.textarea}
              onSend={() => {
                onSend?.();
                setFullscreen(false);
              }}
              ref={ref}
              type={'pure'}
              {...rest}
            />
          </div>
          {bottomAddons}
        </section>
      </DraggablePanel>
    );
  },
);

export default ChatInputArea;