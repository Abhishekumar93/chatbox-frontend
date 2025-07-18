import MessageForm from '@/components/message/messageForm';

const UserMessageDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <>
      <div className="h-100 overflow-y-auto pb-64">Welcome to chat {id}</div>
      <MessageForm />
    </>
  );
};

export default UserMessageDetailPage;
