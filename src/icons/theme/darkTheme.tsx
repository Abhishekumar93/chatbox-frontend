import { FC } from 'react';

interface IDarkThemeIconProps {
  color?: string;
  size?: number;
}

const DarkThemeIcon: FC<IDarkThemeIconProps> = ({
  color = '#000000',
  size = 24,
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      transform="matrix(-1, 0, 0, 1, 0, 0)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="SVGRepo_iconCarrier">
        <path
          d="M31.75,6.479c6.7339,3.8881,10.3177,11.5721,8.969,19.23-1.3496,7.6616-7.3484,13.6604-15.01,15.01-7.6579,1.3487-15.3419-2.2351-19.23-8.969"
          strokeWidth="2"
        ></path>
        <path
          d="M32.02,6.75c4.1858,7.2511,2.98,16.4095-2.94,22.33-5.9205,5.92-15.0789,7.1258-22.33,2.94"
          strokeWidth="2"
        ></path>
        <path d="M10,8v4" strokeWidth="2"></path>
        <path d="M8,10h4" strokeWidth="2"></path>
        <path d="M12,18v3" strokeWidth="2"></path>
        <path d="M10.5,19.5h3" strokeWidth="2"></path>
        <path d="M30.5,14v3" strokeWidth="2"></path>
        <path d="M29,15.5h3" strokeWidth="2"></path>
        <path d="M38.5,5.5v3" strokeWidth="2"></path>
        <path d="M37,7h3" strokeWidth="2"></path>
        <path d="M7.5,41h3" strokeWidth="2"></path>
        <path d="M9,39.5v3" strokeWidth="2"></path>
        <path d="M39.5,36h3" strokeWidth="2"></path>
        <path d="M41,34.5l.02,3" strokeWidth="2"></path>
      </g>
    </svg>
  );
};

export default DarkThemeIcon;
