'use client';

import { use, useEffect, useState } from 'react';
import { getApi } from '@/utils/restApi';
import { useApiProgressDetail } from '@/hooks/useApiProgressDetail';
import socket from '@/utils/socket';
import messageStyle from './message.module.css';
import { Button, Form } from 'react-bootstrap';
import InputField from '@/components/molecules/inputField';

const UserMessageDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { isApiInProgress, setIsApiInProgress } = useApiProgressDetail();

  const [messageList, setMessageList] = useState<any>(null);
  const [isMessageFetched, setIsMessageFetched] = useState<boolean>(false);
  const [currentUserDetail, setCurrentUserDetail] = useState<{
    _id: string;
    name: string;
  }>({ _id: '', name: '' });
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.on('chat message', (message: any) => {
      setMessageList((prevMessages: any) => [...prevMessages, message]);
    });
    socket.on('typing', (data: boolean) => {
      console.log(data, 'typing data');

      setIsTyping(data);
    });
    socket.on('stop_typing', (data: boolean) => {
      setIsTyping(data);
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, []);
  useEffect(() => {
    if (isMessageFetched || isApiInProgress) return;
    fetchMessages();
  }, [id]);

  const fetchMessages = async () => {
    setIsApiInProgress(true);
    try {
      const response = await getApi(`/messages/${id}`);
      setMessageList(response.data?.data?.message ?? []);
      setCurrentUserDetail(response.data?.data?.user ?? { _id: '', name: '' });
    } catch (error) {
      setMessageList([]);
      setCurrentUserDetail({ _id: '', name: '' });
    } finally {
      setIsMessageFetched(true);
      setIsApiInProgress(false);
    }
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const message = e.target.value;
    setMessage(e.target.value);
    socket.emit('typing', true);

    const timer = setTimeout(() => {
      socket.emit('stop_typing', false);
    }, 1000);

    return () => clearTimeout(timer);
  };
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('message', message);
    if (!message.trim()) return;
    socket.emit('new_message', {
      content: message,
      chatId: id,
      sender: currentUserDetail._id,
    });
    setMessage('');
    socket.emit('stop_typing', false);
  };
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
        />
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Form>
    );
  };

  return (
    <>
      <div
        className="overflow-y-auto pb-2 position-relative"
        style={{ height: 'calc(100% - 3rem)' }}
      >
        <p>Start the chat with {currentUserDetail.name}...</p>
        {isTyping && (
          <div className={`${messageStyle['typing-indicator']}`}>Typing...</div>
        )}
      </div>
      {displayMessageForm()}
    </>
  );
};

export default UserMessageDetailPage;
