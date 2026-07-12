'use client';

import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface MaintenanceCard {
  id: string;
  tag: string;
  description: string;
  column: 'pending' | 'approved' | 'assigned' | 'progress' | 'resolved';
  resolvedDate?: string;
}

const initialCards: MaintenanceCard[] = [
  { id: '1', tag: 'AF-0062', description: 'Projector bulb not turning on', column: 'pending' },
  { id: '2', tag: 'AF-003', description: 'AC unit noisy compressor', column: 'approved' },
  { id: '3', tag: 'AF-0078', description: 'Forklift — tech: R Varma', column: 'assigned' },
  { id: '4', tag: 'AF-897', description: 'Printer jam — parts ordered', column: 'progress' },
  { id: '5', tag: 'AF-873', description: 'Chair repair', column: 'resolved', resolvedDate: 'resolved 7 Jul' },
];

const columnConfig = {
  pending: { title: 'Pending', id: 'pending' },
  approved: { title: 'Approved', id: 'approved' },
  assigned: { title: 'Technician assigned', id: 'assigned' },
  progress: { title: 'In progress', id: 'progress' },
  resolved: { title: 'Resolved', id: 'resolved' },
};

export default function Maintenance() {
  const [cards, setCards] = useState<MaintenanceCard[]>(initialCards);

  const getCardsByColumn = (column: MaintenanceCard['column']) => {
    return cards.filter((card) => card.column === column);
  };

  const handleReorderCards = (newCards: MaintenanceCard[], column: MaintenanceCard['column']) => {
    const updatedCards = cards.map((card) => {
      const reorderedCard = newCards.find((nc) => nc.id === card.id);
      return reorderedCard ? { ...reorderedCard, column } : card;
    });
    setCards(updatedCards);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header
            title="Maintenance"
            subtitle="Track repair requests from raised to resolved"
          />

          {/* Kanban Board */}
          <motion.div
            className="grid grid-cols-5 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            {Object.entries(columnConfig).map(([columnKey, columnMeta]) => {
              const columnCards = getCardsByColumn(columnKey as MaintenanceCard['column']);
              const isResolved = columnKey === 'resolved';

              return (
                <div key={columnKey} className="bg-white border border-[#7AAACE]/20 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-[#2E4F66] mb-5 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>
                    {columnMeta.title}
                  </h3>

                  <Reorder.Group
                    axis="y"
                    values={columnCards}
                    onReorder={(newOrder) =>
                      handleReorderCards(newOrder, columnKey as MaintenanceCard['column'])
                    }
                    className="space-y-3"
                  >
                    <AnimatePresence>
                      {columnCards.map((card) => (
                        <Reorder.Item
                          key={card.id}
                          value={card}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <motion.div
                            layout
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={`p-3.5 rounded-lg border border-[#7AAACE]/20 transition-colors duration-200 ${
                              isResolved ? 'bg-emerald-50 hover:bg-emerald-100/50' : 'bg-white hover:bg-[#F5F5ED]'
                            }`}
                          >
                            <p className="text-xs font-semibold text-[#2E4F66]">{card.tag}</p>
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{card.description}</p>
                            {card.resolvedDate && (
                              <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {card.resolvedDate}</p>
                            )}
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </div>
              );
            })}
          </motion.div>

          {/* Caption */}
          <motion.p
            className="text-xs text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Approving a card moves the asset to Under maintenance. Resolving returns it to Available.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
