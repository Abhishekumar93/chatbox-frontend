import { FC } from 'react';

interface IHamburgerIconProps {
  color?: string;
  size?: number;
}

const HamburgerIcon: FC<IHamburgerIconProps> = ({
  color = '#1C274C',
  size = 24,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M20 7L4 7"></path>
        <path d="M20 12L4 12"></path>
        <path d="M20 17L4 17"></path>
      </g>
    </svg>
  );
};

export default HamburgerIcon;
