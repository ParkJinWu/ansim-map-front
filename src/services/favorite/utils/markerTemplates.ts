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