import { useEffect, useRef, useState } from 'react'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'

import { useChat } from '../src'
import { UIMessageToolCallPart } from '@xsai-ext/shared-ui'

// Inline styles for the component
const styles = {
  assistantMessage: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#f0f0f0',
    marginRight: 'auto',
  },
  chatHeader: {
    backgroundColor: '#f0f2f5',
    borderBottom: '1px solid #ddd',
    padding: '10px 15px',
    textAlign: 'center' as const,
  },
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'Arial, sans-serif',
    height: '90vh',
    overflow: 'hidden',
    width: '600px',
  },
  input: {
    border: '1px solid #ddd',
    borderRadius: '20px',
    flex: 1,
    fontSize: '14px',
    outline: 'none',
    padding: '12px',
  },
  inputContainer: {
    backgroundColor: '#f0f2f5',
    borderTop: '1px solid #ddd',
    display: 'flex',
    padding: '10px',
  },
  loadingIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    color: '#666',
    fontSize: '12px',
    padding: '5px 10px',
  },
  messageBox: {
    borderRadius: '18px',
    maxWidth: '80%',
    padding: '10px 15px',
    position: 'relative' as const,
    wordBreak: 'break-word' as const,
  },
  messageContent: {
    fontSize: '14px',
  },
  messagesContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
    padding: '15px',
  },
  messageTime: {
    color: '#999',
    fontSize: '10px',
    marginTop: '2px',
    textAlign: 'right' as const,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '10px',
    padding: '0 15px',
    minWidth: '85px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  sendButtonLoading: {
    backgroundColor: '#ff6347', // Tomato color for cancel
  },
  loadingSpinner: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    marginRight: '6px',
    animation: 'spin 1s linear infinite',
  },
  userMessage: {
    alignSelf: 'flex-end' as const,
    backgroundColor: '#dcf8c6',
    marginLeft: 'auto',
  },
  errorMessage: {
    color: '#ff3b30',
    fontSize: '12px',
    marginTop: '5px',
    padding: '0 5px',
  },
  errorUserMessage: {
    alignSelf: 'flex-end' as const,
    backgroundColor: '#ffdddd',
    borderColor: '#ff3b30',
    borderWidth: '1px',
    borderStyle: 'solid',
    marginLeft: 'auto',
  },
  resetButton: {
    backgroundColor: '#f0f2f5',
    border: '1px solid #ddd',
    borderRadius: '20px',
    color: '#666',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px',
    padding: '5px 10px',
  },
  toolsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
    minHeight: 'fit-content',
  },
  toolBadge: {
    backgroundColor: '#e9ecef',
    borderRadius: '16px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#495057',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #dee2e6',
  },
  toolIcon: {
    color: '#495057',
    fontSize: '14px',
  },
  toolName: {
    fontSize: '13px',
    color: '#495057',
  },
  toolLoading: {
    color: '#666',
  },
  toolsSection: {
    height: '30px',
    padding: '10px',
    alignContent: 'center',
    flexShrink: 0,
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
  },
  toolPart: {
    marginTop: '8px',
    marginBottom: '8px',
    fontSize: '13px',
    position: 'relative' as const,
    width: '100%',
  },
  toolContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '16px 16px 0 0',
    padding: '6px 12px',
    border: '1px solid #dee2e6',
    borderBottom: 'none',
    cursor: 'pointer',
    justifyContent: 'space-between',
  },
  toolContainerClosed: {
    borderRadius: '16px',
    borderBottom: '1px solid #dee2e6',
  },
  toolHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  toolResultContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '0 0 16px 16px',
    padding: '0px 12px',
    border: '1px solid #dee2e6',
    borderTop: 'none',
    fontSize: '12px',
    overflowX: 'auto' as const,
    maxHeight: '150px',
    overflowY: 'auto' as const,
  },
  toolToggleIcon: {
    fontSize: '12px',
    color: '#6c757d',
    marginLeft: '4px',
  },
  toolResultCode: {
    backgroundColor: '#f1f3f5',
    padding: '6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    fontSize: '11px',
  },
  toolStatusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '4px',
  },
  toolStatusComplete: {
    backgroundColor: '#28a745',
  },
  toolStatusError: {
    backgroundColor: '#dc3545',
  },
  toolStatusLoading: {
    backgroundColor: '#6c757d',
  },
  toolStatusPartial: {
    backgroundColor: '#ffc107',
  },
  shimmerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '0 0 16px 16px',
    padding: '8px 12px',
    border: '1px solid #dee2e6',
    borderTop: 'none',
    fontSize: '12px',
    overflow: 'hidden',
  },
  shimmerLine: {
    height: '10px',
    marginBottom: '6px',
    backgroundColor: '#eee',
    backgroundImage: 'linear-gradient(to right, #eee 0%, #ddd 20%, #eee 40%, #eee 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '800px 104px',
    borderRadius: '4px',
    animation: 'shimmer 2s infinite linear',
    overflow: 'hidden',
  },
  shimmerLineShort: {
    width: '40%',
  },
  shimmerLineMedium: {
    width: '65%',
  },
  shimmerLineLong: {
    width: '90%',
  },
  toolHeaderShimmer: {
    backgroundImage: 'linear-gradient(to right, #e9ecef 0%, #f8f9fa 20%, #e9ecef 40%, #e9ecef 100%)',
    backgroundSize: '800px 104px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 0',
    animation: 'shimmer 2s infinite linear',
  }
}

type ToolMap = {
  [key: string]: Awaited<ReturnType<typeof tool>>
}

const UIMessageTextPart = ({ text }: { text: string }) => {
  return (
    <div>
      {text}
    </div>
  )
}

const ShimmerPlaceholder = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes shimmer {
        0% {
          background-position: -468px 0;
        }
        100% {
          background-position: 468px 0;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={styles.shimmerContainer}>
      <div style={{...styles.shimmerLine, ...styles.shimmerLineShort}}></div>
      <div style={{...styles.shimmerLine, ...styles.shimmerLineMedium}}></div>
      <div style={{...styles.shimmerLine, ...styles.shimmerLineLong}}></div>
    </div>
  );
};

const UIMessageToolPart = ({part}:{ part: UIMessageToolCallPart}) => {
  const [showResult, setShowResult] = useState(false);
  const hasResult = part.status === 'complete' || part.status === 'error';
  const isLoading = part.status === 'loading' || part.status === 'partial';

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes shimmer {
        0% {
          background-position: -468px 0;
        }
        100% {
          background-position: 468px 0;
        }
      }
    `;

    if (!document.head.querySelector('style[data-shimmer="true"]')) {
      styleElement.setAttribute('data-shimmer', 'true');
      document.head.appendChild(styleElement);
    }

    return () => {
      // Don't remove, as other components may be using it
    };
  }, []);

  const renderToolResult = () => {
    if (part.status === 'error' && part.error) {
      return (
        <pre style={styles.toolResultCode}>
          {String(part.error)}
        </pre>
      );
    }

    if (part.status === 'complete' && part.result) {
      const result = part.result;
      if (typeof result === 'string') {
        return (
          <pre style={styles.toolResultCode}>
            {result}
          </pre>
        )
      }

      if (Array.isArray(result)) {
        return (
          <div style={styles.toolResultContainer}>
            {result.map((item, index) => {
              if (item.type === 'text') {
                return (
                  <div key={index} style={styles.toolResultCode}>
                    {String(item)}
                  </div>
                )
              }
              if (item.type === 'image_url') {
                return (
                  <img key={index} src={String(item.image_url)} alt="Tool Result" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                )
              }
              if (item.type === 'input_audio') {
                return (
                  <audio key={index} controls>
                    <source src={item.input_audio.data} type={`audio/${item.input_audio.format}`} />
                    Your browser does not support the audio element.
                  </audio>
                )
              }
            })}
          </div>
        )
      }

      // Handle primitive results
      return <div>{String(part.result)}</div>;
    }

    return null;
  };

  return (
    <div style={styles.toolPart}>
      <div
        style={{
          ...styles.toolContainer,
          ...((!hasResult && !isLoading || !showResult) && styles.toolContainerClosed),
          ...(isLoading && styles.toolHeaderShimmer)
        }}
        onClick={() => (hasResult || isLoading) && setShowResult(!showResult)}
        title={(hasResult || isLoading) ? "Click to toggle result" : undefined}
      >
        <div style={styles.toolHeaderLeft}>
          <span style={styles.toolIcon}>🔧</span>
          <span style={styles.toolName}>
            {part.toolCall.function.name}
          </span>
        </div>
        <div style={styles.toolHeaderRight}>
          {(hasResult || isLoading) && (
            <span style={styles.toolToggleIcon}>
              {showResult ? '▼' : '◀'}
            </span>
          )}
        </div>
      </div>

      {isLoading && showResult && (
        <ShimmerPlaceholder />
      )}

      {hasResult && showResult && (
        <div style={{
          ...styles.toolResultContainer,
          ...(part.status === 'error' ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {})
        }}>
          {renderToolResult()}
        </div>
      )}
    </div>
  )
}

// Extracted ChatMessage component
const ChatMessage = ({
  message,
  isError = false
}: {
  message: ReturnType<typeof useChat>['messages'][number],
  isError?: boolean
}) => {
  return (
    <div
      style={{
        ...styles.messageBox,
        ...(message.role === 'user'
          ? (isError ? styles.errorUserMessage : styles.userMessage)
          : styles.assistantMessage),
      }}
    >
      {message.parts.map((part, index) => {
        switch (part.type) {
          case 'text':
            return <UIMessageTextPart key={index} text={part.text} />
          case 'tool-call':
            return <UIMessageToolPart key={part.toolCall.id} part={part} />
          default:
            return <div key={index}>unknown part</div>
        }
      })}
      {isError && (
        <div style={styles.errorMessage}>
          x
        </div>
      )}
    </div>
  )
}

// Simple Chat Component implementation
export function ChatComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [loadedTools, setLoadedTools] = useState<ToolMap>({});

  // Add keyframe animation for spinner
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Load tools on component mount
  useEffect(() => {
    const loadTools = async () => {
      setIsLoadingTools(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const weatherTool = await tool({
          description: 'Get the weather in a location',
          execute: async ({ location }) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (Math.random() > 0.5) {
              throw new Error('Weather API error')
            }
            return {
              location,
              temperature: 10,
            }
          },
          name: 'weather',
          parameters: object({
            location: pipe(
              string(),
              description('The location to get the weather for'),
            ),
          }),
        });

        const calculatorTool = await tool({
          description: 'Calculate mathematical expression',
          execute: ({ expression }) => ({
            result: eval(expression),
          }),
          name: 'calculator',
          parameters: object({
            expression: pipe(
              string(),
              description('The mathematical expression to calculate'),
            ),
          }),
        });

        setLoadedTools({
          weather: weatherTool,
          calculator: calculatorTool
        });
      } catch (err) {
        console.error('Error loading tools:', err);
      } finally {
        setIsLoadingTools(false);
      }
    };

    loadTools();
  }, []);

  const {
    handleSubmit,
    handleInputChange,
    input,
    messages,
    status,
    error,
    reset,
    stop,
  } = useChat({
    id: 'simple-chat',
    preventDefault: true,
    initialMessages: [
      {
        role: 'system',
        content: 'you are a helpful assistant.',
      },
    ],
    baseURL: 'http://localhost:43210/v1/',
    model: 'mistral-nemo-instruct-2407',
    maxSteps: 3,
    toolChoice: 'auto',
    tools: Object.values(loadedTools),
  })

  // Handle send button click based on status
  const handleSendButtonClick = (e: React.MouseEvent) => {
    if (status === 'loading') {
      e.preventDefault();
      stop();
    } else {
      // Let the form submission handle this case
    }
  };

  // Focus input when status changes to idle
  useEffect(() => {
    if (status === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <h2>useChat</h2>
      </div>

      <div style={styles.toolsSection}>
        {isLoadingTools ? (
          <div style={styles.toolLoading}>
            Loading tools...
          </div>
        ) : (
          <div style={styles.toolsContainer}>
            <span>Available tools:</span>
            {Object.keys(loadedTools).map(toolName => (
              <div key={toolName} style={styles.toolBadge}>
                <span style={styles.toolIcon}>🔧</span>
                <span style={styles.toolName}>{toolName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.messagesContainer}>
        {messages.map(message => message ? (
          <ChatMessage
            key={message.id}
            message={message}
            isError={status === 'error'}
          />
        ): 'null')}
      </div>

      <form data-test-id="form" onSubmit={handleSubmit} style={styles.inputContainer}>
        <input
          data-test-id="input"
          onChange={handleInputChange}
          placeholder="say something..."
          style={styles.input}
          value={input}
          disabled={status !== 'idle'}
          ref={inputRef}
        />
        <button
          data-test-id="submit"
          onClick={handleSendButtonClick}
          style={{
            ...styles.sendButton,
            ...(status === 'loading' ? styles.sendButtonLoading : {})
          }}
          type={status === 'loading' ? 'button' : 'submit'}
        >
          {status === 'loading' ? (
            <>
              <div style={styles.loadingSpinner}></div>
              Cancel
            </>
          ) : 'Send'}
        </button>
        <button
          data-test-id="reset"
          onClick={(e) => {
            e.preventDefault();
            reset();
          }}
          style={styles.resetButton}
          type="button"
        >
          Reset
        </button>
      </form>
    </div>
  )
}

// Usage example
export default function ChatExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <ChatComponent />
    </div>
  )
}
