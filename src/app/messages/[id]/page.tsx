import MessageForm from '@/components/message/messageForm';
import { getApi } from '@/utils/restApi';

const UserMessageDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log(id, 'id');
  const messageList = await getApi(`/messages/${id}`);
  // .then(
  //   (response) => response.data,
  // );
  console.log(messageList, 'messageList');

  return (
    <>
      <div className="h-100 overflow-y-auto pb-64">Welcome to chat {id}</div>
      <MessageForm />
    </>
  );
};

export default UserMessageDetailPage;
