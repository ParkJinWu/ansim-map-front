"use client";

import cls from "classnames";

type TabItem = {
  title: string;
  id: string;
};

type Props = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
};

export function Tab({ tabs, activeTab, onTabChange, className }: Props) {
  return (
    <div className={cls("flex items-center justify-center pb-3", className)}>
      <ul className="flex gap-2 rounded-full bg-gray-100 p-1.5 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cls(
                  "px-8 py-2 text-sm font-bold transition-all duration-200 rounded-full",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-200"
                )}
              >
                {tab.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}