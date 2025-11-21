import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Edit2 } from 'lucide-react';
import type { VibeConfig, BentoItemData } from '../types';

interface EditorPanelProps {
  vibeConfig: VibeConfig;
  onUpdateConfig: (newConfig: VibeConfig) => void;
  onEditItem: (item: BentoItemData) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ vibeConfig, onUpdateConfig, onEditItem }) => {
  const { userProfile, items } = vibeConfig;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdateConfig({
      ...vibeConfig,
      userProfile: {
        ...userProfile,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleItemsReorder = (newItems: BentoItemData[]) => {
    // Re-assign IDs based on the new order to ensure stability if keys are index-based
    const itemsWithNewOrder = newItems.map((item, index) => ({ ...item, id: items[index].id }));
    
    onUpdateConfig({
      ...vibeConfig,
      items: newItems,
    });
  };

  return (
    <div className="w-full md:w-1/3 lg:w-2/5 bg-white/30 p-4 sm:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] self-start">
      <h2 className="text-2xl font-bold mb-6">Editor</h2>
      
      {/* Profile Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-3">Profile</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={userProfile.name}
              onChange={handleProfileChange}
              className="w-full text-md px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500]"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-bold mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userProfile.bio}
              onChange={handleProfileChange}
              rows={3}
              className="w-full text-md px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500]"
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div>
        <h3 className="text-lg font-bold mb-3">Links</h3>
        <Reorder.Group axis="y" values={items} onReorder={handleItemsReorder} className="space-y-3">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item} className="bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="text-gray-400 cursor-grab active:cursor-grabbing" />
                <span className="flex-grow font-semibold">{item.title}</span>
                <button onClick={() => onEditItem(item)} className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default EditorPanel;
