import HamburgerIcon from '@/icons/navigation/hamburger';
import styles from './sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={`${styles.sidebar}`}>
      <HamburgerIcon color="grey" />
      <p>This is a sidebar</p>
    </div>
  );
};

export default Sidebar;
