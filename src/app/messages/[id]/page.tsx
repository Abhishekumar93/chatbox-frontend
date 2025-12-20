'use client';

import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getApi } from '@/utils/restApi';
import { useApiProgressDetail } from '@/hooks/useApiProgressDetail';
import socket from '@/utils/socket';
import messageStyle from './message.module.css';
import { Button, Form, Spinner } from 'react-bootstrap';
import InputField from '@/components/molecules/inputField';
import { getLocalStorage } from '@/utils/localStorage';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { generateRoomId } from '@/utils/utils';

interface Message {
  _id: string;
  content: string;
  sender: { _id: string; name: string };
  createdAt: string;
}

interface UserDetail {
  _id: string;
  name: string;
}

const UserMessageDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { isApiInProgress, setIsApiInProgress } = useApiProgressDetail();

  const [messageList, setMessageList] = useState<Message[]>([]);
  const [currentUserDetail, setCurrentUserDetail] = useState<UserDetail>({
    _id: '',
    name: '',
  });
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loggedInUserId, setLoggedInUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [chatId, setCHatId] = useState<string>('');

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const roomId = useMemo(() => {
    if (!loggedInUserId || !id) return '';
    return generateRoomId(btoa(loggedInUserId), id);
  }, [loggedInUserId, id]);

  useEffect(() => {
    const userData = getLocalStorage(LOCAL_STORAGE_KEY.LOGGED_IN_USER_DATA);
    if (userData?._id) {
      setLoggedInUserId(userData._id);
    }
  }, []);
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!id || isApiInProgress || !loggedInUserId) return;

      setIsApiInProgress(true);
      setError(null);

      try {
        const response = await getApi(
          `/messages/${btoa(loggedInUserId)}/${id}`,
        );

        if (isMounted) {
          setMessageList(response.data?.data?.messages ?? []);
          setCurrentUserDetail(
            response.data?.data?.user ?? { _id: '', name: '' },
          );
          setCHatId(response.data?.data?.chatId ?? '');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch messages');
          setMessageList([]);
        }
      } finally {
        if (isMounted) {
          setIsApiInProgress(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [loggedInUserId, id]);
  useEffect(() => {
    if (!loggedInUserId || !id) return;

    const handleChatMessage = (newMessage: Message) => {
      setMessageList((prev) => [...prev, newMessage]);
    };

    const handleTyping = (data: { userId: string; status: boolean }) => {
      setIsTyping((prev) => {
        if (data.userId !== loggedInUserId) {
          return data.status;
        }
        return prev;
      });
    };

    const handleStopTyping = (data: { userId: string; status: boolean }) => {
      setIsTyping((prev) => {
        if (data.userId !== loggedInUserId) {
          return false;
        }
        return prev;
      });
    };

    // Attach listeners ONCE
    socket.on('chat message', handleChatMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    // Cleanup only when component unmounts
    return () => {
      socket.off('chat message', handleChatMessage);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [loggedInUserId]);

  // Register user AND join chat room
  useEffect(() => {
    if (!loggedInUserId || !id) return;

    socket.emit('register', loggedInUserId);

    socket.emit('join_room', {
      chatRoomId: roomId,
      userId: loggedInUserId,
    });
  }, [loggedInUserId, id]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing status
      socket.emit('typing', {
        userId: loggedInUserId,
        chatRoomId: roomId,
        status: true,
      });

      // Set timer to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', {
          userId: loggedInUserId,
          chatRoomId: roomId,
          status: false,
        });
      }, 1000);
    },
    [loggedInUserId, id],
  );

  const handleSubmitMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      socket.emit('new_message', {
        content: message.trim(),
        participants: [btoa(loggedInUserId), id],
        chatRoomId: roomId,
        chatId,
      });

      setMessage('');

      // Stop typing indicator
      socket.emit('stop_typing', {
        userId: loggedInUserId,
        chatRoomId: roomId,
        status: false,
      });

      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    },
    [message, id, loggedInUserId, roomId, chatId],
  );

  const displayMessageForm = () => {
    return (
      <Form
        className={`${messageStyle['message-form']}`}
        onSubmit={handleSubmitMessage}
      >
        <InputField
          name="message_box"
          placeholder="Type message..."
          formGroupClassName="mb-0 w-100"
          onChange={handleMessageChange}
          value={message}
          autoComplete="off"
        />
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Form>
    );
  };

  if (isApiInProgress && messageList.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div
        className="overflow-y-auto pb-2 position-relative"
        style={{ height: 'calc(100% - 3rem)' }}
      >
        {currentUserDetail.name && (
          <h5 className={messageStyle['chat-header']}>
            Chat with {currentUserDetail.name}
          </h5>
        )}
        <div className={messageStyle['message-list']}>
          {messageList.length === 0 ? (
            <p className="text-center text-muted mt-4">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messageList.map((msg) => (
              <div
                key={msg._id}
                className={`w-100 ${msg.sender._id === loggedInUserId ? '' : messageStyle['message-received']}`}
              >
                <div className={`${messageStyle['message-content']}`}>
                  <p>{msg.content}</p>
                  <span className={messageStyle['timestamp']}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>
        {isTyping && (
          <div className={`${messageStyle['typing-indicator']}`}>
            {currentUserDetail.name || 'User'} is typing...
          </div>
        )}
      </div>
      {displayMessageForm()}
    </>
  );
};

export default UserMessageDetailPage;
