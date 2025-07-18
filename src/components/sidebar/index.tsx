import styles from './sidebar.module.css';
import { UsersList } from '../userList';

const Sidebar = () => {
  return (
    <div className={`${styles.sidebar}`}>
      <UsersList />
    </div>
  );
};

export default Sidebar;
