import { FavoriteResponse } from '../type';

export const favoriteMarkerContent = (fav: FavoriteResponse) => {
  // 나중에 fav.category 등에 따라 색상이나 아이콘을 변경
  const color = '#0ea5e9'; // 기본 Sky-500
  const label = fav.alias || fav.placeName;

  return `
    <div class="custom-marker-wrapper" style="transform: translate(-50%, -100%);">
      <div style="
        padding: 6px 12px;
        background: white;
        border: 2px solid ${color};
        border-radius: 99px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 4px;
        pointer-events: auto;
      ">
        <span style="color: ${color}; font-size: 14px;">★</span>
        <span style="
          font-size: 13px; 
          font-weight: 700; 
          color: #334155;
          white-space: nowrap;
        ">${label}</span>
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${color};
        margin: 0 auto;
      "></div>
    </div>
  `;
};


export const currentLocationMarkerContent = () => {
  return `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 30px;
        height: 30px;
        background: rgba(14, 165, 233, 0.4);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
      <div style="
        width: 14px;
        height: 14px;
        background: #0ea5e9;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        z-index: 1;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    </div>
  `;
};