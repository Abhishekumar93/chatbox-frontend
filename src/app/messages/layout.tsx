import MessageLayoutComponent from '@/components/message/messageLayout';

interface IMessageLayoutProps {
  children: React.ReactNode;
}

const MessageLayout = ({ children }: IMessageLayoutProps) => {
  return <MessageLayoutComponent>{children}</MessageLayoutComponent>;
};
export default MessageLayout;
