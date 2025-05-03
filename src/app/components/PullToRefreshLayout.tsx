'use client';
import {Spinner} from "@heroui/spinner";

import { useEffect, useRef, useState } from 'react';

export default function PullToRefreshLayout({ children }: { children: React.ReactNode }) {
  const startYRef = useRef<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const threshold = 60; // Pixels to trigger refresh

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current !== null) {
        const distance = e.touches[0].clientY - startYRef.current;
        if (distance > 0) {
          setPullDistance(Math.min(distance, 100));
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > threshold) {
        triggerRefresh();
      } else {
        setPullDistance(0);
      }
      startYRef.current = null;
    };

    const triggerRefresh = async () => {
      setIsRefreshing(true);
      await new Promise((res) => setTimeout(res, 1000)); // Simulate async refresh
      window.location.reload(); // Replace with your own data refetch if needed
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance]);

  return (
    <div>
      <div
        style={{
          height: isRefreshing ? 50 : pullDistance,
          transition: isRefreshing ? 'height 0.3s' : 'none',
          background: '#fff',
          textAlign: 'center',
          lineHeight: '60px',
          fontSize: 15,
        }}
      >
        {isRefreshing ? <Spinner size="sm" variant="simple" /> : pullDistance > 0 ? 'Ricarica Pagina' : ''}
      </div>
      <div>{children}</div>
    </div>
  );
}
