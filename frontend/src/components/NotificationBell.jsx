import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationService from '../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await NotificationService.getNotifications(false); // get all to show history
      const allNotifs = res.data || [];
      setNotifications(allNotifs);
      setUnreadCount(allNotifs.filter(n => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling every 15 seconds for real-time feel
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.preventDefault();
    try {
      await NotificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getIconForType = (type) => {
    if (type.startsWith('task_')) return <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg"><Info size={14} /></div>;
    if (type.startsWith('approval_')) return <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><Check size={14} /></div>;
    return <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg"><Info size={14} /></div>;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 origin-top-right"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/30">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <BellOff className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60">
                  {notifications.map(notif => (
                    <Link
                      key={notif.id}
                      to={notif.link || '#'}
                      onClick={(e) => {
                        if (!notif.is_read) handleMarkAsRead(notif.id, null);
                        setIsOpen(false);
                      }}
                      className={`block p-4 hover:bg-slate-800/50 transition-colors ${!notif.is_read ? 'bg-slate-800/20' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">{getIconForType(notif.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                              {notif.title}
                            </h4>
                            {!notif.is_read && (
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide font-semibold">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
